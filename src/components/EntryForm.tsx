import { AutocompleteField, Button, Dialog, Field, Flex, NativeDateField, Stack, Text, fr } from "@prismane/core";
import { ChangeEvent, useState } from "react";
import { DateTime } from "luxon";
import { TimeTableEntry, createEntry, formatHours, parseHours } from "../data/entry";

interface EntryFormProps {
    entry?: TimeTableEntry;
    date?: DateTime;
    start?: DateTime;
    title: string;
    onSubmit: (entry: TimeTableEntry) => void;
    onCancel: () => void;
    onDelete?: (entry: TimeTableEntry) => void;
}

export default function EntryForm({ entry, date: initDate, start: initStart, title, onSubmit, onCancel, onDelete }: EntryFormProps) {
    /* implementation note:
    The useForm hook is not used to prevent type information loss and 
    calculations (duration) are done ad hoc so handling data as strings is 
    not very suitable here.*/
    const [date, setDate] = useState(initDate ?? entry?.start ?? DateTime.now());
    const [start, setStart] = useState(initStart ?? entry?.start);
    const [end, setEnd] = useState(entry?.end);
    const [project, setProject] = useState(entry?.project ?? "");
    const [deleteOpen, setDeleteOpen] = useState(false);
    /* Raw duration input, kept only while the user types in that field, so
    intermediate values ("1." while typing "1.5") survive the round trip. */
    const [durationInput, setDurationInput] = useState<string>();

    const projects = ["TSapp", "ITmeetsOT", "aWall"]; // TODO replace with actual store data
    const options = projects.map(p => ({
        value: p,
        element: p
    }));

    const updateDate = (event: ChangeEvent<HTMLInputElement>) => {
        const date = DateTime.fromISO(event.target.value);
        if (!date.isValid) return;
        const day = { day: date.day, month: date.month, year: date.year };
        setDate(date);
        setDurationInput(undefined);
        if (start) setStart(start.set(day));
        if (end) setEnd(end.set(day));
    };

    /** Parse a `HH:mm` field value onto the currently selected day. */
    const timeOf = (value: string) => {
        const time = DateTime.fromISO(value);
        return time.isValid
            ? date.set({ hour: time.hour, minute: time.minute, second: 0, millisecond: 0 })
            : undefined;
    };

    const updateStart = (event: ChangeEvent<HTMLInputElement>) => {
        setDurationInput(undefined);
        setStart(timeOf(event.target.value));
    };

    const updateEnd = (event: ChangeEvent<HTMLInputElement>) => {
        setDurationInput(undefined);
        setEnd(timeOf(event.target.value));
    };

    const updateDuration = (event: ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value;
        setDurationInput(raw);
        const hours = parseHours(raw);
        if (hours === undefined) {
            if (raw.trim() === "") setEnd(undefined);
            return;
        }
        const from = start ?? date;
        setStart(from);
        setEnd(from.plus({ hours: hours }));
    };

    const duration = start && end ? end.diff(start).as("hours") : undefined;
    const durationValue = durationInput ?? (duration !== undefined ? formatHours(duration) : "");
    const endError = duration !== undefined && duration <= 0 ? "Before start" : undefined;
    const canSubmit = !!start && !!end && !endError;

    const submit = () => {
        if (!canSubmit) return;
        const e = entry ? {
            ...entry,
            start: start,
            end: end,
            project: project
        } : createEntry(start, end, project);
        onSubmit(e);
    };

    const doDelete = () => {
        if (onDelete && entry) onDelete(entry);
        setDeleteOpen(false);
    };

    return (
        <>
            <Stack direction="column" gap={fr(2)} of="visible">
                <Text as="h2">{title}</Text>
                <NativeDateField value={date.toISODate() ?? ""} onChange={updateDate} name="date" label="Date" />
                <Stack direction="row" align="start">
                    <Field.Wrapper>
                        <Field.Label htmlFor="start">Start</Field.Label>
                        <Field value={start?.toFormat("HH:mm") ?? ""} onChange={updateStart} type="time" name="start" id="start" size="xs" />
                    </Field.Wrapper>
                    <Field.Wrapper>
                        <Field.Label htmlFor="end">End</Field.Label>
                        <Field value={end?.toFormat("HH:mm") ?? ""} onChange={updateEnd} type="time" name="end" id="end" size="xs"
                            error={endError} />
                        {endError && <Field.Error size="xs">{endError}</Field.Error>}
                    </Field.Wrapper>
                    <Field.Wrapper>
                        <Field.Label htmlFor="duration">Duration</Field.Label>
                        <Field value={durationValue} onChange={updateDuration} type="number" name="duration" id="duration" size="xs"
                            min={0} step={0.25} />
                    </Field.Wrapper>
                </Stack>
                <AutocompleteField label="Project"
                    value={project}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProject(e.target.value ?? "")}
                    options={options}
                />
                <Flex gap={fr(1)} align="center">
                    {onDelete && <Button onClick={() => setDeleteOpen(true)} variant="tertiary">Delete</Button>}
                    <Button onClick={onCancel} variant="tertiary" ml="auto">Cancel</Button>
                    <Button onClick={submit} disabled={!canSubmit}>Save</Button>
                </Flex>
            </Stack>
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} position="bottom" animation="slide-down" closable>
                <Dialog.Header>
                    <Text as="h2">Delete entry</Text>
                </Dialog.Header>
                <Text>Do you want to delete this entry irrevocably?</Text>
                <Dialog.Footer gap={fr(1)} justify="end">
                    <Button onClick={doDelete} variant="tertiary">Yes</Button>
                    <Button onClick={() => setDeleteOpen(false)}>No</Button>
                </Dialog.Footer>
            </Dialog>
        </>
    );
}
