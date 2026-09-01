import { ActionButton, Card, Center, SegmentedField, Stack, Table, Text, fr } from "@prismane/core";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { DateTime } from "luxon";
import { ChangeEvent, useState } from "react";
import { ReportUnit, hoursPerProject, labelOf, periodOf, totalHours } from "../data/report";
import { formatHours } from "../data/entry";
import { useDataStore } from "../data/useDataStore";

export default function ReportScreen() {
    const entries = useDataStore(s => s.entries);
    const [unit, setUnit] = useState<ReportUnit>("week");
    const [date, setDate] = useState(DateTime.now());

    const period = periodOf(date, unit);
    const rows = hoursPerProject(entries, period);

    return (
        <Stack w="100%" p={fr(4)} gap={fr(4)} align="center" bs="border-box">
            <Stack direction="row" w="100%" justify="center" align="center" gap={fr(2)} grow={false}>
                <ActionButton icon={<CaretLeftIcon size={32} />} aria-label="Previous"
                    onClick={() => setDate(date.minus({ [unit]: 1 }))} />
                <Text fw="bold" miw={fr(60)} ta="center">{labelOf(period, unit)}</Text>
                <ActionButton icon={<CaretRightIcon size={32} />} aria-label="Next"
                    onClick={() => setDate(date.plus({ [unit]: 1 }))} />
                <SegmentedField
                    value={unit} name="unit"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUnit(e.target.value as ReportUnit)}
                    options={[{ element: "week", value: "week" }, { element: "month", value: "month" }]}
                />
            </Stack>
            {rows.length === 0
                ? <Center p={fr(8)}><Text cl={["base", 500]}>Nothing tracked in this period.</Text></Center>
                : <Card w="100%" maw={fr(160)} p={fr(4)}>
                    <Table w="100%">
                        <Table.Head>
                            <Table.Row>
                                <Table.Cell as="th" ta="left">Project</Table.Cell>
                                <Table.Cell as="th" ta="right">Hours</Table.Cell>
                            </Table.Row>
                        </Table.Head>
                        <Table.Body>
                            {rows.map(r => (
                                <Table.Row key={r.project ?? ""}>
                                    <Table.Cell>{r.project ?? "(no project)"}</Table.Cell>
                                    <Table.Cell ta="right">{formatHours(r.hours)}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                        <Table.Foot>
                            <Table.Row>
                                <Table.Cell fw="bold">Total</Table.Cell>
                                <Table.Cell fw="bold" ta="right">{formatHours(totalHours(rows))}</Table.Cell>
                            </Table.Row>
                        </Table.Foot>
                    </Table>
                </Card>
            }
        </Stack>
    );
}
