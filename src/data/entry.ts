import { DateTime, Duration } from "luxon";

export interface TimeTableEntry {
    id: string;
    start: DateTime;
    end: DateTime;
    project?: string;
}

/**
 * Create a new `TimeTableEntry` with a random id.
 * @param start 
 * @param end 
 * @param project 
 * @returns
 */
export function createEntry(start: DateTime, end: DateTime, project?: string): TimeTableEntry {
    return {
        id: crypto.randomUUID(),
        start: start,
        end: end,
        project: project,
    };
}

/**
 * Get duration of an entry from start and end date.
 * @param entry 
 * @returns 
 */
export function getDuration(entry: TimeTableEntry): Duration<boolean> {
    return entry.end.diff(entry.start);
}
/**
 * Parse a duration in hours from raw field input.
 * @returns the parsed hours or `undefined` if the input is not a usable number
 */
export function parseHours(raw: string): number | undefined {
    const hours = Number(raw);
    if (raw.trim() === "" || !Number.isFinite(hours) || hours < 0) return undefined;
    return hours;
}

/** Format a duration in hours for a number field (at most two decimals). */
export function formatHours(hours: number): string {
    return parseFloat(hours.toFixed(2)).toString();
}
