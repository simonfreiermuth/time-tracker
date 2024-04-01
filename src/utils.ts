/**
 * Create an array with length `end - start` initialized with
 * index as value.
 * @param start 
 * @param end 
 * @returns 
 */
export function range(start: number, end: number) {
    return Array.from({ length: end - start }, (_, i) => i);
}