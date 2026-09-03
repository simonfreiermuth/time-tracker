import { Box, Stack, Text, fr, usePrismaneColor } from "@prismane/core";
import { ProjectHours, formatHoursMinutes, totalHours } from "../data/report";
import { colorOf } from "../data/project";
import { useDataStore } from "../data/useDataStore";

const SIZE = 180;
const RADIUS = 70;
const WIDTH = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Each project's arc of the donut: its length and where it starts. */
function slicesOf(rows: ProjectHours[], total: number) {
    let offset = 0;
    return rows.map(r => {
        const length = (r.hours / total) * CIRCUMFERENCE;
        const slice = { project: r.project, length: length, offset: offset };
        offset += length;
        return slice;
    });
}

/** Share of the period's hours per project, as a donut with a legend. */
export default function HoursPieChart({ rows }: { rows: ProjectHours[] }) {
    const projects = useDataStore(s => s.projects);
    const { getColor } = usePrismaneColor();
    const total = totalHours(rows);

    /** Projects without a colour of their own — the unassigned ones — stay neutral. */
    const color = (project?: string) => {
        const c = colorOf(projects, project);
        return getColor(c === "primary" ? "base" : c, 500);
    };

    const slices = slicesOf(rows, total);

    return (
        <Stack direction="row" align="center" justify="center" wrap="wrap" gap={fr(8)} w="100%">
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Hours per project">
                <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
                    {slices.map(s => (
                        <circle
                            key={s.project ?? ""}
                            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
                            fill="none" stroke={color(s.project)} strokeWidth={WIDTH}
                            strokeDasharray={`${s.length} ${CIRCUMFERENCE - s.length}`}
                            strokeDashoffset={-s.offset}
                        />
                    ))}
                </g>
            </svg>
            <Stack gap={fr(2)}>
                {rows.map(r => (
                    <Stack key={r.project ?? ""} direction="row" align="center" gap={fr(2)}>
                        <Box w={fr(3)} h={fr(3)} br="full" bg={color(r.project)} />
                        <Text>{r.project ?? "(no project)"}</Text>
                        <Text cl={["base", 500]}>
                            {formatHoursMinutes(r.hours)} · {Math.round((r.hours / total) * 100)}%
                        </Text>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
}
