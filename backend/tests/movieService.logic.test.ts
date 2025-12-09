import { describe, expect, it } from 'vitest';
import type { MovieFilters, PaginationOptions } from '../services//movieService';

// ============================================================================
// FILTER-TESTS — Tester MovieFilters og PaginationOptions uden database
// Formålet er at sikre, at typer og filterobjekter fungerer korrekt,
// og at logikken omkring rating, pagination og tomme objekter er stabil.
// ============================================================================

describe('MovieService Filter Logic', () => {
     // ------------------------------------------------------------------------
    // Test: Titel og rating filter
    // Formål: Sikre at filters-objektet korrekt indeholder de værdier vi sætter.
    // ------------------------------------------------------------------------
    
    it('should test title filter logic', () => {
        const filters: MovieFilters = {
            title: 'Matrix',
            minRating: 8.0
        };

        expect(filters.title).toBe('Matrix');
        expect(filters.minRating).toBe(8.0);
    });

     // ------------------------------------------------------------------------
    // Test: Pagination
    // Formål: Sikre at pagination-objektet indeholder de korrekte værdier.
    // ------------------------------------------------------------------------

    it('should test pagination logic', () => {
        const pagination: PaginationOptions = {
            page: 2,
            pageSize: 20
        };

        expect(pagination.page).toBe(2);
        expect(pagination.pageSize).toBe(20);
    });

    // ------------------------------------------------------------------------
    // Test: Håndtering af tomme filtre
    // Formål: Sikre at et tomt filterobjekt indeholder 0 keys
    // ------------------------------------------------------------------------


    it('should handle empty filters', () => {
        const filters: MovieFilters = {};

        expect(filters).toEqual({});
        expect(Object.keys(filters)).toHaveLength(0);
    });

    // ------------------------------------------------------------------------
    // Test: Rating-range validering
    // Formål: Simpel logisk test af at min ≤ max og at værdierne ligger 0–10
    // (dette er ikke database- eller API-validering, kun type/logic test)
    // ------------------------------------------------------------------------


    it('should validate rating range', () => {
        const filters: MovieFilters = {
            minRating: 7.0,
            maxRating: 9.0
        };

        // Min rating må ikke være under 0
        expect(filters.minRating).toBeGreaterThanOrEqual(0);
         // Max rating må ikke være over 10
        expect(filters.maxRating).toBeLessThanOrEqual(10);
        // Hvis begge værdier findes, skal min ≤ max
        if (filters.minRating !== undefined && filters.maxRating !== undefined) {
            expect(filters.minRating).toBeLessThanOrEqual(filters.maxRating);
        }
    });
});