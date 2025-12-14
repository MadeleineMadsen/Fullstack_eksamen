import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import fs from "fs";
import morgan from "morgan";
import path from "path";

import { AppDataSource } from "./data-source";
import tmdbRoutes from './routes/tmdbRoutes';
import { setupRouters } from "./startup/setupRouters";
import { setupSwagger } from "./swagger";

const app = express();

// ====== MIDDLEWARE ======

// Opret logs mappen hvis den ikke findes
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// HTTP logging af alle requests (metode, URL, statuskode, svartid osv.)
// Logger til FIL
const accessLogStream = fs.createWriteStream(
    path.join(logDir, 'access.log'),
    { flags: 'a' }
);

app.use(morgan('combined', {
    stream: accessLogStream
}));

// Også log til console (valgfrit)
app.use(morgan('dev'));

console.log(`📝 Morgan logging enabled. Logs will be written to: ${logDir}/access.log`);

// Gør så Express kan læse JSON-body på requests
app.use(express.json());

// Gør så vi kan læse cookies på req.cookies (bl.a. auth_token)
app.use(cookieParser());

// CORS-konfiguration – hvilke domæner må tale sammen med backend
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "https://fullstack-eksamen.onrender.com",
];

app.use(
    cors({
        origin: allowedOrigins,// Kun disse origins er tilladt
        credentials: true,  // Tillad cookies/credentials på tværs af origin
    })
);

// ====== ROUTES ======

// Swagger dokumentation (API docs)
setupSwagger(app);

// Vores egne API-routes: /api/movies og /api/auth
setupRouters(app);

// TMDB proxy-routes: /api/tmdb/...
app.use('/api/tmdb', tmdbRoutes);

// ====== LOGGING ENDPOINTS ======

// 1. Endpoint til at logge FE-errors fra frontend til fil
app.post('/api/log-error', (req, res) => {
    try {
        const logEntry = req.body;
        const timestamp = new Date().toISOString();
        
        // Loglinje format til fil
        const logLine = `[${timestamp}] [FRONTEND] ${logEntry.message} - ${logEntry.error || 'No error'} (${logEntry.url})\n`;

        console.log(`📱 Frontend error logged: ${logEntry.message}`);
        
        // Opret logs-mappe hvis den ikke findes
        const logDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }

        // Append FE-fejl til frontend-errors.log
        fs.appendFileSync(path.join(logDir, "frontend-errors.log"), logLine);

        res.json({
            success: true,
            message: "Frontend error logged successfully",
            timestamp: timestamp
        });

    } catch (error: any) {
        console.error('Failed to log frontend error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to log error',
            details: error.message
        });
    }
});

// 2. Endpoint til at hente log-filer (access, backend, frontend)
app.get('/api/logs', (req, res) => {
    try {
        const type = req.query.type as string || 'access';
        const logDir = path.join(__dirname, 'logs');

        let filename: string;
        let description: string;

        // Vælg hvilken log-fil der skal læses
        switch (type) {
            case 'frontend':
                filename = path.join(logDir, "frontend-errors.log");
                description = "Frontend Errors";
                break;
            case 'backend':
                filename = path.join(logDir, "backend-errors.log");
                description = "Backend Errors";
                break;
            case 'access':
            default:
                filename = path.join(logDir, "access.log");
                description = "Access Logs";
                break;
        }

        // Hvis filen ikke findes endnu → svar pænt
        if (!fs.existsSync(filename)) {
            return res.json({
                success: true,
                message: `Log file "${description}" does not exist yet`,
                file: path.basename(filename),
                description: description,
                logs: [],
                count: 0,
                exists: false
            });
        }

        // Læs hele filen
        const content = fs.readFileSync(filename, 'utf-8');
        const logs = content.split('\n').filter(line => line.trim());

        // Send de seneste 50 entries
        res.json({
            success: true,
            file: path.basename(filename),
            description: description,
            count: logs.length,
            exists: true,
            logs: logs.slice(-50), // Last 50 entries
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: 'Failed to read logs',
            message: error.message
        });
    }
});

// 3. Test-endpoint der skriver en test-linje til access-log
app.get('/api/log-test', (req, res) => {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [TEST] Test log entry created via API\n`;

    console.log(` Test log created`);

    try {
        const logDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }

        fs.appendFileSync(path.join(logDir, "access.log"), logLine);

        res.json({
            success: true,
            message: "Test log entry created",
            timestamp: timestamp,
            logFile: "access.log"
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: "Failed to create test log",
            message: error.message
        });
    }
});

// ====== BASIC ENDPOINTS ======

// Health-check endpoint – bruges til at se om serveren kører
app.get("/", (req, res) => {
    res.json({
        message: " Movie API Backend is running!",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        endpoints: {
            docs: "/api-docs",
            health: "/health",
            movies: "/api/movies",
            auth: "/api/auth",
            tmdb: "/api/tmdb",
            logging: {
                frontend_errors: "POST /api/log-error",
                get_logs: "GET /api/logs?type=access|backend|frontend",
                test_log: "GET /api/log-test"
            },
            test: {
                health: "/health",
                error: "/test-error"
            }
        },
        logging: {
            enabled: true,
            morgan: true,
            types: ["access", "backend-errors", "frontend-errors"]
        }
    });
});

// Health-check endpoint – bruges til at se om serveren kører
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        tmdbApiKey: !!process.env.TMDB_API_KEY,
        database: "connected",// Forenklet status (rigtig status kræver ekstra check)
        logging: {
            morgan: true,
            endpoints: true,
            files: true
        },
        services: {
            database: "postgresql",
            caching: "N/A",
            external_apis: "TMDB"
        }
    });
});

// Test-error endpoint – udløser en fejl med logning til backend-errors.log
app.get("/test-error", (req, res, next) => {
    const error = new Error("Test error for logging system");
    const timestamp = new Date().toISOString();

    // Log til konsollen
    console.error(` Test error triggered at ${timestamp}: ${error.message}`);

    // Skriv fejlen i backend-errors.log
    try {
        const logDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }

        const errorLog = `[${timestamp}] ERROR: ${error.message}\nURL: GET /test-error\nIP: ${req.ip}\nUSER-AGENT: ${req.get('User-Agent')}\nSTACK: ${error.stack}\n---\n`;
        fs.appendFileSync(path.join(logDir, "backend-errors.log"), errorLog);

        console.log(`Test error written to backend-errors.log`);
    } catch (fileError: any) {
        console.error("Failed to write test error to file:", fileError.message);
    }

    // Giv fejlen videre til global error handler
    next(error);
});

// Test-success endpoint – succesfuld route der også dukker op i logs
app.get("/test-success", (req, res) => {
    res.json({
        message: "Success test route for logging",
        timestamp: new Date().toISOString(),
        note: "This request should appear in Morgan logs and access.log"
    });
});

// ====== ERROR HANDLER ======
// Global error handler – fanger alle errors fra resten af appen
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const timestamp = new Date().toISOString();
    const errorLog = `[${timestamp}]
        ERROR: ${err.message}
        URL: ${req.method} ${req.url}
        IP: ${req.ip}
        USER-AGENT: ${req.get('User-Agent')}
        STACK:
        ${err.stack}
        ---
        `;

    // Log til konsollen
    console.error(" Server error:", err.message);

    try {
        const logDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }

         // Skriv til backend-errors.log
        fs.appendFileSync(path.join(logDir, "backend-errors.log"), errorLog);
        console.log(` Error written to backend-errors.log`);
    } catch (fileError: any) {
        console.error("Failed to write error to file:", fileError.message);
    }

    // Send generisk fejlrespons til klienten
    res.status(500).json({
        error: "Internal server error",
        timestamp: timestamp,
        requestId: `req_${Date.now()}`,
        // Only show details in development
        ...(process.env.NODE_ENV === 'development' && {
            message: err.message
        })
    });
});

// 404 handler – fanges hvis ingen af de andre routes matcher
app.use((req, res) => {
    const timestamp = new Date().toISOString();

    // Log 404 til konsol
    console.log(`[${timestamp}] [404] ${req.method} ${req.url}`);

    // Skriv 404 til access.log
    try {
        const logDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }
        fs.appendFileSync(
            path.join(logDir, 'access.log'),
            `[${timestamp}] ${req.method} ${req.url} 404 0ms\n`
        );
    } catch (error: any) {
        console.error('Failed to write 404 to access log:', error.message);
    }

    res.status(404).json({
        error: "Not Found",
        message: `Route ${req.method} ${req.url} not found`,
        timestamp: timestamp,
        availableEndpoints: [
            "/",
            "/health",
            "/api-docs",
            "/test-error",
            "/test-success",
            "/api/logs",
            "/api/log-test"
        ]
    });
});

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;

console.log(" Starting Movie API Backend with enhanced logging...");
console.log(" Morgan HTTP logging enabled");
console.log(" Log files will be saved to: ./logs/");
console.log(" Logging endpoints:");
console.log("   POST /api/log-error    - For frontend errors");
console.log("   GET  /api/logs         - To view logs");
console.log("   GET  /api/log-test     - Test log creation");

// Initier databaseforbindelse og start serveren
AppDataSource.initialize()
    .then(() => {
        console.log(" Database connected successfully!");

        // Sørg for at logs-mappen findes ved startup
        const logDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
            console.log(" Created logs directory");
        }

        app.listen(PORT, () => {
            console.log(` Server running on port ${PORT}`);
            console.log(` Local URL: http://localhost:${PORT}`);
            console.log(` Health check: http://localhost:${PORT}/health`);
            console.log(` Test error: http://localhost:${PORT}/test-error`);
            console.log(` Test success: http://localhost:${PORT}/test-success`);
            console.log(` View logs: http://localhost:${PORT}/api/logs?type=access`);
            console.log(` Create test log: http://localhost:${PORT}/api/log-test`);
        });
    })
    .catch((err) => {
        console.error(" Error initializing database:", err);
        process.exit(1);
    });
