import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    
    // Plugins til Vite konfiguration
    plugins: [react()],     // Aktiverer React plugin for at understøtte JSX/TSX
    
    // Test-konfiguration for Vitest
    test: {

        // Indstil test-miljø til jsdom (til frontend-test)
        environment: "jsdom",
        
        // Aktivér globale variabler til testene (fx `describe`, `it`, `expect`)
        globals: true,
        
        // Angiv en setup-fil der kører før testene starter
        setupFiles: "./src/test/setupTests.ts",     // Fil der opsætter globale test-variabler eller mocks
    },
});
