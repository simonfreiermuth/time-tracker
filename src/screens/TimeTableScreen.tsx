import TimeTable, { TimeTableEntry } from "../components/TimeTable";
import { DateTime } from "luxon";
import { ActionButton, Button, Flex, Modal, NativeDateField, Stack, fr } from "@prismane/core";
import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import EntryForm from "../components/EntryForm";

export default function TimeTableScreen() {
    const entries: TimeTableEntry[] = [
        { id: "1", start: DateTime.local(2024, 4, 1, 8), end: DateTime.local(2024, 4, 1, 12), project: "TSapp" },
        { id: "2", start: DateTime.local(2024, 4, 1, 13), end: DateTime.local(2024, 4, 1, 18) },
        { id: "3", start: DateTime.local(2024, 4, 2, 8), end: DateTime.local(2024, 4, 2, 11) },
    ];

    const thisWeek = DateTime.now().startOf("week");
    const [date, setDate] = useState(thisWeek);
    const updateDate = (raw: string) => {
        const d = DateTime.fromISO(raw);
        if (d.isValid) setDate(d.startOf("week"));
        else console.error("could not convert date", d);
    }
    const lastWeek = () => setDate(date.plus({ days: 7 }));
    const nextWeek = () => setDate(date.minus({ days: 7 }));

    return (
        <Stack w="100%" p={fr(4)} bs="border-box">
            <Stack direction="row" w="100%" justify="center" align="center">
                <ActionButton icon={<CaretLeft size={32} />} onClick={lastWeek} />
                <NativeDateField name="date" value={date.toISODate()} onChange={(e: any) => updateDate(e.target.value)} />
                <Button onClick={() => setDate(thisWeek)} size="md">This week</Button>
                <ActionButton icon={<CaretRight size={32} />} onClick={nextWeek} />
            </Stack>
            <Flex w="100%" h="80vh">
                <TimeTable
                    start={date}
                    days={5}
                    entries={entries}
                    onClickEntry={() => console.log("click on entry...")}
                    onClickTable={(d) => console.log("click on table...", d.toISO())}
                />
            </Flex>
            <Modal open={true} of="visible" >
                <EntryForm
                    entry={entries[0]}
                    onSubmit={e => console.log(e)}
                    onCancel={() => { }}
                    title={"Edit entry"}
                />
            </Modal>
        </Stack>
    )
}