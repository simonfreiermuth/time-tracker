import { ActionButton, Button, Card, Center, Divider, SegmentedField, Stack, Table, Tabs, Text, fr } from "@prismane/core";
import { CaretLeftIcon, CaretRightIcon, ChartBarIcon, ChartPieIcon, CheckIcon, MinusIcon } from "@phosphor-icons/react";
import { DateTime } from "luxon";
import { ChangeEvent, useState } from "react";
import { ExportState, ReportUnit, entriesInPeriod, entriesOfProject, exportStateOf, formatHoursMinutes, hoursPerBucket, hoursPerProject, labelOf, periodOf, totalHours } from "../data/report";
import { TimeTableEntry } from "../data/entry";
import { useDataStore } from "../data/useDataStore";
import HoursBarChart from "../components/HoursBarChart";
import HoursPieChart from "../components/HoursPieChart";

/** What the export button says — clicking it marks everything that isn't exported yet. */
const EXPORT_LABEL: Record<ExportState, string> = { none: "Mark", some: "Partly", all: "Exported" };

interface ExportButtonProps {
    state: ExportState;
    label?: string;
    onClick: () => void;
}

function ExportButton({ state, label, onClick }: ExportButtonProps) {
    return (
        <Button size="sm" variant={state === "all" ? "primary" : "tertiary"} onClick={onClick}
            icon={state === "all" ? <CheckIcon /> : state === "some" ? <MinusIcon /> : undefined}>
            {label ?? EXPORT_LABEL[state]}
        </Button>
    );
}

export default function ReportScreen() {
    const entries = useDataStore(s => s.entries);
    const setExported = useDataStore(s => s.setExported);
    const [unit, setUnit] = useState<ReportUnit>("week");
    const [date, setDate] = useState(DateTime.now());

    const period = periodOf(date, unit);
    const rows = hoursPerProject(entries, period);
    const total = exportStateOf(entriesInPeriod(entries, period));

    /** Export what is left, or take the mark back once everything carries it. */
    const toggle = (of: TimeTableEntry[], state: ExportState) => setExported(of, state !== "all");

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
                : <Card w="100%" maw={fr(160)} p={fr(4)} direction="column">
                    <Table w="100%">
                        <Table.Head>
                            <Table.Row>
                                <Table.Cell as="th" ta="left">Project</Table.Cell>
                                <Table.Cell as="th" ta="right">Hours</Table.Cell>
                                <Table.Cell as="th" ta="right">Exported</Table.Cell>
                            </Table.Row>
                        </Table.Head>
                        <Table.Body>
                            {rows.map(r => (
                                <Table.Row key={r.project ?? ""}>
                                    <Table.Cell>{r.project ?? "(no project)"}</Table.Cell>
                                    <Table.Cell ta="right">{formatHoursMinutes(r.hours)}</Table.Cell>
                                    <Table.Cell ta="right">
                                        <ExportButton state={r.exported}
                                            onClick={() => toggle(entriesOfProject(entries, period, r.project), r.exported)} />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                        <Table.Foot>
                            <Table.Row>
                                <Table.Cell fw="bold">Total</Table.Cell>
                                <Table.Cell fw="bold" ta="right">{formatHoursMinutes(totalHours(rows))}</Table.Cell>
                                <Table.Cell ta="right">
                                    <ExportButton state={total} label={total === "all" ? undefined : "Mark all"}
                                        onClick={() => toggle(entriesInPeriod(entries, period), total)} />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Foot>
                    </Table>
                    <Divider my={fr(4)} />
                    <Tabs defaultValue="pie" variant="underlined" direction="column" gap={fr(4)}>
                        <Tabs.List>
                            <Tabs.Tab value="pie" gap={fr(2)}><ChartPieIcon size={20} />Per project</Tabs.Tab>
                            <Tabs.Tab value="bars" gap={fr(2)}><ChartBarIcon size={20} />Per {unit === "week" ? "day" : "week"}</Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="pie"><HoursPieChart rows={rows} /></Tabs.Panel>
                        <Tabs.Panel value="bars"><HoursBarChart buckets={hoursPerBucket(entries, period, unit)} /></Tabs.Panel>
                    </Tabs>
                </Card>
            }
        </Stack>
    );
}
