import { DateTime, Duration, Interval } from "luxon";
import { TimeTableEntry, getDuration } from "./entry";

/** How much of a set of entries carries the export mark. */
export type ExportState = "none" | "some" | "all";

/** Hours worked on one project (`project` is undefined for unassigned entries). */
export interface ProjectHours {
    project?: string;
    hours: number;
    exported: ExportState;
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

export function exportStateOf(entries: TimeTableEntry[]): ExportState {
    const exported = entries.filter(e => e.exported).length;
    if (exported === 0) return "none";
    return exported === entries.length ? "all" : "some";
}

/** Every entry starting within `period`. */
export function entriesInPeriod(entries: TimeTableEntry[], period: Interval): TimeTableEntry[] {
    return entries.filter(e => period.contains(e.start));
}

/** The period's entries of one project — without a name, the unassigned ones. */
export function entriesOfProject(entries: TimeTableEntry[], period: Interval, project?: string): TimeTableEntry[] {
    return entriesInPeriod(entries, period).filter(e => (e.project || undefined) === project);
}

/**
 * Sum the hours of every entry starting within `period`, grouped by project.
 * Longest first; unassigned entries come last.
 */
export function hoursPerProject(entries: TimeTableEntry[], period: Interval): ProjectHours[] {
    const groups = new Map<string | undefined, TimeTableEntry[]>();
    for (const entry of entriesInPeriod(entries, period)) {
        const project = entry.project || undefined;
        groups.set(project, [...(groups.get(project) ?? []), entry]);
    }
    return [...groups]
        .map(([project, entries]) => ({
            project: project,
            hours: entries.reduce((sum, e) => sum + getDuration(e).as("hours"), 0),
            exported: exportStateOf(entries),
        }))
        .sort((a, b) => (a.project === undefined ? 1 : b.project === undefined ? -1 : 0) || b.hours - a.hours);
}

export function totalHours(rows: ProjectHours[]): number {
    return rows.reduce((sum, r) => sum + r.hours, 0);
}

/** Format a number of hours as `hh:mm`. */
export function formatHoursMinutes(hours: number): string {
    return Duration.fromObject({ hours }).toFormat("hh:mm");
}

/** Hours worked in one bucket of a period — a day of a week, a week of a month. */
export interface BucketHours {
    label: string;
    hours: number;
}

/** Sum the period's hours over its natural buckets: days for a week, calendar weeks for a month. */
export function hoursPerBucket(entries: TimeTableEntry[], period: Interval, unit: ReportUnit): BucketHours[] {
    const inPeriod = entriesInPeriod(entries, period);
    const step = unit === "week" ? "day" : "week";
    const buckets: BucketHours[] = [];
    for (let t = period.start?.startOf(step); t && period.end && t < period.end; t = t.plus({ [step]: 1 })) {
        const bucket = Interval.after(t, { [step]: 1 });
        buckets.push({
            label: unit === "week" ? t.toFormat("EEE") : `W${t.weekNumber}`,
            hours: inPeriod
                .filter(e => bucket.contains(e.start))
                .reduce((sum, e) => sum + getDuration(e).as("hours"), 0),
        });
    }
    return buckets;
}
