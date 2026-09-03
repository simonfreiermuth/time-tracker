import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { TimeTableEntry, createEntry } from "./entry";
import { entriesOfProject, exportStateOf, formatHoursMinutes, hoursPerBucket, hoursPerProject, labelOf, periodOf, totalHours } from "./report";

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
            { project: "TSapp", hours: 4, exported: "none" },
            { project: "aWall", hours: 3.5, exported: "none" },
            { project: undefined, hours: 1, exported: "none" },
        ]);
    });

    it("covers the whole month when asked for one", () => {
        expect(hoursPerProject(entries, periodOf(SEPTEMBER_1, "month"))).toEqual([
            { project: "aWall", hours: 11.5, exported: "none" },
            { project: "TSapp", hours: 4, exported: "none" },
            { project: undefined, hours: 1, exported: "none" },
        ]);
    });

    it("is empty when nothing falls into the period", () => {
        expect(hoursPerProject(entries, periodOf(SEPTEMBER_1.minus({ years: 1 }), "week"))).toEqual([]);
    });
});

describe("export state", () => {
    const exported = (e: TimeTableEntry) => ({ ...e, exported: true });

    it("tells apart nothing, some and all exported entries", () => {
        const es = [entry(1, 2, "aWall"), entry(2, 1, "aWall")];
        expect(exportStateOf(es)).toBe("none");
        expect(exportStateOf([exported(es[0]), es[1]])).toBe("some");
        expect(exportStateOf(es.map(exported))).toBe("all");
    });

    it("comes with every report row", () => {
        const entries = [exported(entry(1, 2, "aWall")), entry(2, 1.5, "aWall"), entry(3, 4, "TSapp")];
        expect(hoursPerProject(entries, periodOf(SEPTEMBER_1, "week"))).toEqual([
            { project: "TSapp", hours: 4, exported: "none" },
            { project: "aWall", hours: 3.5, exported: "some" },
        ]);
    });
});

describe("entriesOfProject", () => {
    const entries = [entry(1, 2, "aWall"), entry(2, 1, "aWall"), entry(3, 4), entry(20, 8, "aWall")];

    it("picks the period's entries of one project", () => {
        expect(entriesOfProject(entries, periodOf(SEPTEMBER_1, "week"), "aWall"))
            .toEqual([entries[0], entries[1]]);
    });

    it("picks the unassigned ones without a project", () => {
        expect(entriesOfProject(entries, periodOf(SEPTEMBER_1, "week"))).toEqual([entries[2]]);
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

describe("hoursPerBucket", () => {
    const entries = [entry(1, 2, "aWall"), entry(1, 1), entry(3, 4, "TSapp"), entry(20, 8, "aWall")];

    it("splits a week into its seven days", () => {
        expect(hoursPerBucket(entries, periodOf(SEPTEMBER_1, "week"), "week")).toEqual([
            { label: "Mon", hours: 0 }, // 31.08.
            { label: "Tue", hours: 3 }, // 01.09.
            { label: "Wed", hours: 0 },
            { label: "Thu", hours: 4 }, // 03.09.
            { label: "Fri", hours: 0 },
            { label: "Sat", hours: 0 },
            { label: "Sun", hours: 0 },
        ]);
    });

    it("splits a month into its calendar weeks", () => {
        expect(hoursPerBucket(entries, periodOf(SEPTEMBER_1, "month"), "month")).toEqual([
            { label: "W36", hours: 7 },
            { label: "W37", hours: 0 },
            { label: "W38", hours: 8 }, // 20.09.
            { label: "W39", hours: 0 },
            { label: "W40", hours: 0 },
        ]);
    });
});
