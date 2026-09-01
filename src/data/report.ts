import { DateTime, Duration, Interval } from "luxon";
import { TimeTableEntry, getDuration } from "./entry";

/** Hours worked on one project (`project` is undefined for unassigned entries). */
export interface ProjectHours {
    project?: string;
    hours: number;
}

/** The period a report covers. */
export type ReportUnit = "week" | "month";

export function periodOf(date: DateTime, unit: ReportUnit): Interval {
    return Interval.fromDateTimes(date.startOf(unit), date.endOf(unit));
}

/** How the period is labelled above the report. */
export function labelOf(period: Interval, unit: ReportUnit): string {
    const start = period.start;
    if (!start) return "";
    return unit === "month"
        ? start.toFormat("LLLL yyyy")
        : `Week ${start.weekNumber} · ${start.toFormat("dd.LL.")} – ${period.end?.toFormat("dd.LL.yyyy") ?? ""}`;
}

/**
 * Sum the hours of every entry starting within `period`, grouped by project.
 * Longest first; unassigned entries come last.
 */
export function hoursPerProject(entries: TimeTableEntry[], period: Interval): ProjectHours[] {
    const hours = new Map<string | undefined, number>();
    for (const entry of entries) {
        if (!period.contains(entry.start)) continue;
        const project = entry.project || undefined;
        hours.set(project, (hours.get(project) ?? 0) + getDuration(entry).as("hours"));
    }
    return [...hours]
        .map(([project, hours]) => ({ project, hours }))
        .sort((a, b) => (a.project === undefined ? 1 : b.project === undefined ? -1 : 0) || b.hours - a.hours);
}

export function totalHours(rows: ProjectHours[]): number {
    return rows.reduce((sum, r) => sum + r.hours, 0);
}

/** Format a number of hours as `hh:mm`. */
export function formatHoursMinutes(hours: number): string {
    return Duration.fromObject({ hours }).toFormat("hh:mm");
}
