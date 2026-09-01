import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { createEntry, formatHours, getDuration, parseHours } from "./entry";

describe("getDuration", () => {
    it("is the span between start and end", () => {
        const entry = createEntry(DateTime.fromISO("2026-09-01T09:00"), DateTime.fromISO("2026-09-01T11:30"));
        expect(getDuration(entry).as("hours")).toBe(2.5);
    });
});

describe("parseHours", () => {
    it.each([
        ["2", 2],
        ["1.5", 1.5],
        [" 0.25 ", 0.25],
        ["0", 0],
    ])("parses %j as %j", (raw, hours) => expect(parseHours(raw)).toBe(hours));

    it.each(["", "  ", "abc", "NaN", "-1"])("rejects %j", raw =>
        expect(parseHours(raw)).toBeUndefined());
});

describe("formatHours", () => {
    it.each([
        [1.5, "1.5"],
        [2, "2"],
        [1 + 1 / 60, "1.02"],
        [0.25, "0.25"],
    ])("formats %j as %j", (hours, text) => expect(formatHours(hours)).toBe(text));
});
