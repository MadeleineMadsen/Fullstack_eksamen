// index.ts
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
app.use(morgan("combined"));  // Morgan HTTP logging
app.use(express.json());
app.use(cookieParser());

// CORS
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "https://fullstack-eksamen.onrender.com",
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// ====== ROUTES ======
setupSwagger(app);
setupRouters(app);
app.use('/api/tmdb', tmdbRoutes);

// ====== LOGGING ENDPOINTS ======

// 1. Frontend error logging endpoint
app.post('/api/log-error', (req, res) => {
    try {
        const logEntry = req.body;
        const timestamp = new Date().toISOString();
        const logLine = `[${timestamp}] [FRONTEND] ${logEntry.message} - ${logEntry.error || 'No error'} (${logEntry.url})\n`;

        console.log(`📱 Frontend error logged: ${logEntry.message}`);

        // Create logs directory if it doesn't exist
        const logDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }

        // Append to frontend errors log
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

// 2. Get logs endpoint (for debugging and monitoring)
app.get('/api/logs', (req, res) => {
    try {
        const type = req.query.type as string || 'access';
        const logDir = path.join(__dirname, 'logs');

        let filename: string;
        let description: string;

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

        const content = fs.readFileSync(filename, 'utf-8');
        const logs = content.split('\n').filter(line => line.trim());

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

// 3. Test log endpoint (creates a log entry)
app.get('/api/log-test', (req, res) => {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [TEST] Test log entry created via API\n`;

    console.log(`📝 Test log created`);

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

// Root route (info)
app.get("/", (req, res) => {
    res.json({
        message: "🎬 Movie API Backend is running!",
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

// Health-check
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        tmdbApiKey: !!process.env.TMDB_API_KEY,
        database: "connected",
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

// Test error route (with improved logging)
app.get("/test-error", (req, res, next) => {
    const error = new Error("Test error for logging system");
    const timestamp = new Date().toISOString();

    // Log to console
    console.error(`❌ Test error triggered at ${timestamp}: ${error.message}`);

    // Write to backend error log file
    try {
        const logDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }

        const errorLog = `[${timestamp}] ERROR: ${error.message}\nURL: GET /test-error\nIP: ${req.ip}\nUSER-AGENT: ${req.get('User-Agent')}\nSTACK: ${error.stack}\n---\n`;
        fs.appendFileSync(path.join(logDir, "backend-errors.log"), errorLog);

        console.log(`✅ Test error written to backend-errors.log`);
    } catch (fileError: any) {
        console.error("Failed to write test error to file:", fileError.message);
    }

    next(error);
});

// Test success route (for logging demonstration)
app.get("/test-success", (req, res) => {
    res.json({
        message: "Success test route for logging",
        timestamp: new Date().toISOString(),
        note: "This request should appear in Morgan logs and access.log"
    });
});

// ====== ERROR HANDLER ======
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

    // Log to console
    console.error("❌ Server error:", err.message);

    // Write to backend error log file
    try {
        const logDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }

        fs.appendFileSync(path.join(logDir, "backend-errors.log"), errorLog);
        console.log(`✅ Error written to backend-errors.log`);
    } catch (fileError: any) {
        console.error("Failed to write error to file:", fileError.message);
    }

    // Send response to client
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

// 404 handler (after all routes)
app.use((req, res) => {
    const timestamp = new Date().toISOString();

    // Log 404
    console.log(`[${timestamp}] [404] ${req.method} ${req.url}`);

    // Also log to access.log
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

console.log("🚀 Starting Movie API Backend with enhanced logging...");
console.log("📊 Morgan HTTP logging enabled");
console.log("📁 Log files will be saved to: ./logs/");
console.log("🌐 Logging endpoints:");
console.log("   POST /api/log-error    - For frontend errors");
console.log("   GET  /api/logs         - To view logs");
console.log("   GET  /api/log-test     - Test log creation");

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database connected successfully!");

        // Create logs directory on startup
        const logDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
            console.log("📁 Created logs directory");
        }

        app.listen(PORT, () => {
            console.log(`🌍 Server running on port ${PORT}`);
            console.log(`🔗 Local URL: http://localhost:${PORT}`);
            console.log(`📈 Health check: http://localhost:${PORT}/health`);
            console.log(`🐛 Test error: http://localhost:${PORT}/test-error`);
            console.log(`✅ Test success: http://localhost:${PORT}/test-success`);
            console.log(`📊 View logs: http://localhost:${PORT}/api/logs?type=access`);
            console.log(`📝 Create test log: http://localhost:${PORT}/api/log-test`);
        });
    })
    .catch((err) => {
        console.error("❌ Error initializing database:", err);
        process.exit(1);
    });
