import TimeTable from "../components/TimeTable";
import { DateTime } from "luxon";
import { ActionButton, Button, Flex, Modal, NativeDateField, Stack, fr } from "@prismane/core";
import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import EntryForm from "../components/EntryForm";
import { useAppStore } from "../data/store";
import { TimeTableEntry } from "../data/entry";

export default function TimeTableScreen() {
    const entries = useAppStore(state => state.entries);
    const addEntry = useAppStore(state => state.addEntry);

    const thisWeek = DateTime.now().startOf("week");
    const [date, setDate] = useState(thisWeek);
    const updateDate = (raw: string) => {
        const d = DateTime.fromISO(raw);
        if (d.isValid) setDate(d.startOf("week"));
        else console.error("could not convert date", d);
    }
    const lastWeek = () => setDate(date.minus({ days: 7 }));
    const nextWeek = () => setDate(date.plus({ days: 7 }));

    const [createEntryOpen, setCreateEntryOpen] = useState(false);
    const [createEntryDate, setCreateEntryDate] = useState<DateTime | undefined>(undefined);
    const createEntry = (date?: DateTime) => {
        setCreateEntryDate(date ?? DateTime.now());
        setCreateEntryOpen(true);
    };
    const submitEntry = (entry: TimeTableEntry) => {
        addEntry(entry);
        setCreateEntryDate(undefined);
        setCreateEntryOpen(false);
    };

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
                    onClickTable={createEntry}
                />
            </Flex>
            <Modal open={createEntryOpen} of="visible" >
                <EntryForm
                    date={createEntryDate}
                    start={createEntryDate}
                    onSubmit={e => submitEntry(e)}
                    onCancel={() => setCreateEntryOpen(false)}
                    title={"Create new entry"}
                />
            </Modal>
        </Stack>
    )
}