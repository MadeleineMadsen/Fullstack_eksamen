// Trailer-interface
// Beskriver en filmtrailer tilknyttet en Movie
export default interface Trailer {
    id: number;
    name: string;
    preview: string;
    data480: string;
    dataMax: string;    // URL til trailer i højeste tilgængelige kvalitet
}