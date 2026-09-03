import { Box, Stack, Text, fr } from "@prismane/core";
import { BucketHours, formatHoursMinutes } from "../data/report";

const HEIGHT = 160;

/** Hours per day of the week or per week of the month, as bars. */
export default function HoursBarChart({ buckets }: { buckets: BucketHours[] }) {
    const max = Math.max(...buckets.map(b => b.hours));

    return (
        <Stack direction="row" align="end" justify="center" gap={fr(2)} w="100%">
            {buckets.map(b => (
                <Stack key={b.label} align="center" gap={fr(1)} grow maw={fr(20)}>
                    <Text fs="sm" cl={["base", 500]}>{b.hours > 0 ? formatHoursMinutes(b.hours) : ""}</Text>
                    <Box w="100%" h={max > 0 ? (b.hours / max) * HEIGHT : 0} mih={2} br="base" bg="primary" />
                    <Text fs="sm">{b.label}</Text>
                </Stack>
            ))}
        </Stack>
    );
}
