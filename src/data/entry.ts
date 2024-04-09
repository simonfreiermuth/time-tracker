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