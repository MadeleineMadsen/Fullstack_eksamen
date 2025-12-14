/// <reference types="vite/client" />

// Typing af Vite environment variables
interface ImportMetaEnv {
    readonly VITE_TMDB_API_KEY: string;
}

// Udvider ImportMeta med env
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
