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

    const thisWeek = DateTime.now().minus({days: DateTime.now().weekday - 1});
    const [date, setDate] = useState(thisWeek);
    const updateDate = (raw: string) => {
        const d = DateTime.fromISO(raw);
        if (d.isValid) setDate(d);
        else console.error("could not convert date", d);
    }
    const lastWeek = () => setDate(date.plus({ days: 7 }));
    const nextWeek = () => setDate(date.minus({ days: 7 }));

    return (
        <Stack w="100%" p={fr(4)} bs="border-box">
            <Stack direction="row" w="100%" justify="center" align="center">
                <ActionButton icon="⬅" onClick={lastWeek} />
                <NativeDateField name="date" value={date.toISODate()} onChange={(e: any) => updateDate(e.value.target)} />
                <Button onClick={()  => setDate(thisWeek)} size="md">This week</Button>
                <ActionButton icon="➡" onClick={nextWeek} />
            </Stack>
            <Flex w="100%" h="80vh">
                <TimeTable
                    start={date}
                    days={5}
                    entries={entries}
                />
            </Flex>
        </Stack>
    )
}