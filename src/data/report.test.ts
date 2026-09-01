import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { createEntry } from "./entry";
import { formatHoursMinutes, hoursPerProject, labelOf, periodOf, totalHours } from "./report";

const entry = (day: number, hours: number, project?: string) =>
    createEntry(
        DateTime.fromISO(`2026-09-${String(day).padStart(2, "0")}T08:00`),
        DateTime.fromISO(`2026-09-${String(day).padStart(2, "0")}T08:00`).plus({ hours }),
        project);

// 2026-09-01 is a Tuesday, so its week runs 2026-08-31 .. 2026-09-06
const SEPTEMBER_1 = DateTime.fromISO("2026-09-01T12:00");

describe("hoursPerProject", () => {
    const entries = [
        entry(1, 2, "aWall"),
        entry(2, 1.5, "aWall"),
        entry(3, 4, "TSapp"),
        entry(4, 1),          // unassigned
        entry(20, 8, "aWall"), // outside the week
    ];

    it("sums the entries of the period per project, longest first", () => {
        expect(hoursPerProject(entries, periodOf(SEPTEMBER_1, "week"))).toEqual([
            { project: "TSapp", hours: 4 },
            { project: "aWall", hours: 3.5 },
            { project: undefined, hours: 1 },
        ]);
    });

    it("covers the whole month when asked for one", () => {
        expect(hoursPerProject(entries, periodOf(SEPTEMBER_1, "month"))).toEqual([
            { project: "aWall", hours: 11.5 },
            { project: "TSapp", hours: 4 },
            { project: undefined, hours: 1 },
        ]);
    });

    it("is empty when nothing falls into the period", () => {
        expect(hoursPerProject(entries, periodOf(SEPTEMBER_1.minus({ years: 1 }), "week"))).toEqual([]);
    });
});

describe("totalHours", () => {
    it("adds every row up", () => {
        expect(totalHours(hoursPerProject([entry(1, 2, "a"), entry(1, 3)], periodOf(SEPTEMBER_1, "week")))).toBe(5);
    });
});

describe("formatHoursMinutes", () => {
    it("formats hours as hh:mm", () => {
        expect(formatHoursMinutes(0)).toBe("00:00");
        expect(formatHoursMinutes(3.5)).toBe("03:30");
        expect(formatHoursMinutes(0.25)).toBe("00:15");
        expect(formatHoursMinutes(123.75)).toBe("123:45");
    });
});

describe("labelOf", () => {
    it("names the month", () => {
        expect(labelOf(periodOf(SEPTEMBER_1, "month"), "month")).toBe("September 2026");
    });

    it("names the week with its range", () => {
        expect(labelOf(periodOf(SEPTEMBER_1, "week"), "week")).toBe("Week 36 · 31.08. – 06.09.2026");
    });
});
