const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const log = {
    info: (msg: string, data?: any) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [INFO] ${msg}`, data || '');
    },

    error: (msg: string, err?: any) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] [ERROR] ${msg}`, err || '');

        // Send to backend logging API
        const logData = {
            message: msg,
            error: err?.message || err?.toString() || 'Unknown error',
            stack: err?.stack,
            url: window.location.href,
            timestamp: timestamp,
            userAgent: navigator.userAgent,
        };

        // Send to backend (non-blocking)
        fetch(`${API_URL}/api/log-error`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logData),
        }).catch(() => {
            console.warn('Failed to send error to backend');
        });
    },

    warn: (msg: string, data?: any) => {
        const timestamp = new Date().toISOString();
        console.warn(`[${timestamp}] [WARN] ${msg}`, data || '');
    },

    debug: (msg: string, data?: any) => {
        if (import.meta.env.DEV) {
            const timestamp = new Date().toISOString();
            console.debug(`[${timestamp}] [DEBUG] ${msg}`, data || '');
        }
    },
};