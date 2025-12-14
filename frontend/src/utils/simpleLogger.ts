const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Central log-service til frontend
export const log = {
    
    // Info-log (kun console)
    info: (msg: string, data?: any) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [INFO] ${msg}`, data || '');
    },

    // Error-log (console + backend)
    error: (msg: string, err?: any) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] [ERROR] ${msg}`, err || '');

        // Data der sendes til backend logging endpoint
        const logData = {
            message: msg,
            error: err?.message || err?.toString() || 'Unknown error',
            stack: err?.stack,
            url: window.location.href,
            timestamp: timestamp,
            userAgent: navigator.userAgent,
        };

        // Non-blocking send til backend
        fetch(`${API_URL}/api/log-error`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logData),
        }).catch(() => {
            console.warn('Failed to send error to backend');
        });
    },

    // Warning-log
    warn: (msg: string, data?: any) => {
        const timestamp = new Date().toISOString();
        console.warn(`[${timestamp}] [WARN] ${msg}`, data || '');
    },

    // Debug-log (kun i DEV)
    debug: (msg: string, data?: any) => {
        if (import.meta.env.DEV) {
            const timestamp = new Date().toISOString();
            console.debug(`[${timestamp}] [DEBUG] ${msg}`, data || '');
        }
    },
};