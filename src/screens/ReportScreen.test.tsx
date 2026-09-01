import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { DateTime } from "luxon";
import { renderUI } from "../test/render";
import ReportScreen from "./ReportScreen";
import { createEntry } from "../data/entry";

// Wednesday — its week is 14.–20.09., so 09.09. is last week and 02.09. is
// this month but not this week.
const TODAY = "2026-09-16";

beforeAll(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(`${TODAY}T12:00:00`));
});
afterAll(() => vi.useRealTimers());

const entry = (day: string, hours: number, project?: string) => {
    const start = DateTime.fromISO(`2026-09-${day}T08:00`);
    return createEntry(start, start.plus({ hours: hours }), project);
};

const row = (label: string) => screen.getByText(label).closest("tr")!;

describe("ReportScreen", () => {
    it("says so when nothing was tracked", () => {
        renderUI(<ReportScreen />);
        expect(screen.getByText("Nothing tracked in this period.")).toBeInTheDocument();
    });

    it("sums this week's hours per project and totals them", () => {
        renderUI(<ReportScreen />, {
            entries: [entry("16", 2, "aWall"), entry("17", 1.5, "aWall"), entry("16", 1), entry("02", 8, "TSapp")],
        });

        expect(screen.getByText("Week 38 · 14.09. – 20.09.2026")).toBeInTheDocument();
        expect(row("aWall")).toHaveTextContent("03:30");
        expect(row("(no project)")).toHaveTextContent("01:00");
        expect(screen.queryByText("TSapp")).not.toBeInTheDocument();
        expect(row("Total")).toHaveTextContent("04:30");
    });

    it("steps to the previous period", () => {
        renderUI(<ReportScreen />, { entries: [entry("09", 3, "aWall")] });

        expect(screen.getByText("Nothing tracked in this period.")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Previous" }));

        expect(screen.getByText("Week 37 · 07.09. – 13.09.2026")).toBeInTheDocument();
        expect(row("aWall")).toHaveTextContent("03:00");
    });

    it("switches to a monthly report", () => {
        renderUI(<ReportScreen />, { entries: [entry("16", 2, "aWall"), entry("02", 8, "TSapp")] });

        fireEvent.click(screen.getByText("month"));

        expect(screen.getByText("September 2026")).toBeInTheDocument();
        expect(row("TSapp")).toHaveTextContent("08:00");
        expect(row("Total")).toHaveTextContent("10:00");
    });
});
