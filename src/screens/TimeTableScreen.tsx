import TimeTable from "../components/TimeTable";
import { DateTime } from "luxon";
import { ActionButton, Button, Flex, Modal, NativeDateField, Stack, fr } from "@prismane/core";
import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import EntryForm from "../components/EntryForm";
import { TimeTableEntry } from "../data/entry";
import { useStoreContext } from "../data/StoreProvider";

export default function TimeTableScreen() {
    const entries = useStoreContext(state => state.entries);
    const addEntry = useStoreContext(state => state.addEntry);
    const updateEntry = useStoreContext(state => state.updateEntry);
    const deleteEntry = useStoreContext(state => state.deleteEntry);

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
    const onCreateEntry = (date?: DateTime) => {
        setCreateEntryDate(date ?? DateTime.now());
        setCreateEntryOpen(true);
    };
    const submitCreateEntry = (entry: TimeTableEntry) => {
        addEntry(entry);
        setCreateEntryDate(undefined);
        setCreateEntryOpen(false);
    };

    const [editEntry, setEditEntry] = useState<TimeTableEntry | undefined>(undefined);
    const [editEntryOpen, setEditEntryOpen] = useState(false);
    const onEditEntry = (entry: TimeTableEntry) => {
        setEditEntry(entry);
        setEditEntryOpen(true);
    };
    const submitEditEntry = (entry: TimeTableEntry) => {
        updateEntry(entry);
        setEditEntry(undefined);
        setEditEntryOpen(false);
    };
    const submitDeleteEntry = (entry: TimeTableEntry) => {
        setEditEntryOpen(false);
        setEditEntry(undefined);
        deleteEntry(entry);
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
                    onClickEntry={onEditEntry}
                    onClickTable={onCreateEntry}
                />
            </Flex>
            <Modal open={createEntryOpen} of="visible" onClose={() => setCreateEntryOpen(false)} closable >
                <EntryForm
                    date={createEntryDate}
                    start={createEntryDate}
                    onSubmit={e => submitCreateEntry(e)}
                    onCancel={() => setCreateEntryOpen(false)}
                    title={"Create new entry"}
                />
            </Modal>
            <Modal open={editEntryOpen} of="visible" onClose={() => setEditEntryOpen(false)} closable >
                <EntryForm
                    entry={editEntry}
                    onSubmit={submitEditEntry}
                    onCancel={() => setEditEntryOpen(false)}
                    onDelete={submitDeleteEntry}
                    title={"Edit entry"}
                />
            </Modal>
        </Stack>
    )
}