import TimeTable, { TimeTableEntry } from "../components/TimeTable";
import { DateTime } from "luxon";
import { ActionButton, Button, Flex, NativeDateField, Stack, fr } from "@prismane/core";
import { useState } from "react";

export default function TimeTableScreen() {
    const entries: TimeTableEntry[] = [
        { start: DateTime.local(2024, 4, 1, 8), end: DateTime.local(2024, 4, 1, 12), information: "TSapp" },
        { start: DateTime.local(2024, 4, 1, 13), end: DateTime.local(2024, 4, 1, 18) },
        { start: DateTime.local(2024, 4, 2, 8), end: DateTime.local(2024, 4, 2, 11) },
    ];

    const [date, setDate] = useState(DateTime.now().minus({days: DateTime.now().weekday - 1}));
    const updateDate = (raw: string) => {
        const d = DateTime.fromISO(raw);
        if (d.isValid) setDate(d);
        else console.error("could not convert date", d);
    }
    const lastWeek = () => setDate(date.plus({ days: 7 }));
    const nextWeek = () => setDate(date.minus({ days: 7 }));

    return (
        <Stack w="100%" p={fr(4)} bs="border-box">
            <Flex w="100%">
                <ActionButton icon="⬅" onClick={lastWeek} />
                <NativeDateField name="date" value={date.toISODate()} onChange={(e: any) => updateDate(e.value.target)} />
                <Button onClick={() => setDate(DateTime.now())}>Heute</Button>
                <ActionButton icon="➡" onClick={nextWeek} />
            </Flex>
            <Flex w="100%" h="80vh">
                <TimeTable
                    start={date}
                    days={5}
                    entries={entries}
                // onClick={(e) => setModalEntry(e)}
                />
            </Flex>
        </Stack>
    )
}