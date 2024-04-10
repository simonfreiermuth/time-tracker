import { AutocompleteField, Button, Field, Flex, NativeDateField, NumberField, Stack, Text, fr } from "@prismane/core";
import { useState } from "react";
import { DateTime } from "luxon";
import { TimeTableEntry, createEntry } from "../data/entry";

interface EntryFormProps {
    entry?: TimeTableEntry;
    date?: DateTime;
    start?: DateTime;
    title: string;
    onSubmit: (entry: TimeTableEntry) => void;
    onCancel: () => void;
}

export default function EntryForm({ entry, date: initDate, start: initStart, title, onSubmit, onCancel }: EntryFormProps) {
    /* implementation note:
    The useForm hook is not used to prevent type information loss and 
    calculations (duration) are done ad hoc so handling data as strings is 
    not very suitable here.*/
    const [date, setDate] = useState(initDate ?? entry?.start ?? DateTime.now());
    const [start, setStart] = useState(initStart ?? entry?.start);
    const [end, setEnd] = useState(entry?.end);
    const [project, setProject] = useState(entry?.project ?? "");

    const projects = ["TSapp", "ITmeetsOT", "aWall"]; // TODO replace with actual store data
    const options = projects.map(p => ({
        value: p,
        element: p
    }));

    const updateDate = (event: any) => {
        const date = DateTime.fromISO(event.target.value);
        if (!date.isValid) {
            console.error("could not convert date", date);
            return;
        }
        setDate(date);
        if (start) setStart(start.set({ day: date.day, month: date.month, year: date.year }));
        if (end) setEnd(end.set({ day: date.day, month: date.month, year: date.year }));
    };
    const updateStart = (event: any) => {
        const [hour, minute] = event.target.value
            .split(":")
            .map((s: string) => parseInt(s));
        const d = start ?? date;
        setStart(d.set({ hour: hour, minute: minute }));
    };
    const updateEnd = (event: any) => {
        const [hour, minute] = event.target.value
            .split(":")
            .map((s: string) => parseInt(s));
        const d = end ?? date;
        setEnd(d.set({ hour: hour, minute: minute }));
    };
    const updateDuration = (event: any) => {
        const h = parseInt(event.target.value);
        console.log("h", h);
        if (!start) setStart(date);
        setEnd((start ?? date).plus({ hours: h }));
    };

    const submit = () => {
        if (!start || !end) return;
        const e = entry ? {
            ...entry,
            start: start,
            end: end,
            project: project
        } : createEntry(start, end, project);
        onSubmit(e);
    };

    const canSubmit = start && end;

    return (
        <Stack direction="column" gap={fr(2)} of="visible">
            <Text as="h2">{title}</Text>
            <NativeDateField value={date.toISODate() ?? ""} onChange={updateDate} name="date" label="Date" />
            <Stack direction="row">
                <Field.Wrapper>
                    <Field.Label>Start</Field.Label>
                    <Field value={start?.toFormat("hh:mm")} onChange={updateStart} type="time" name="start" size="xs" />
                </Field.Wrapper>
                <Field.Wrapper>
                    <Field.Label>End</Field.Label>
                    <Field value={end?.toFormat("hh:mm")} onChange={updateEnd} type="time" name="end" size="xs" />
                </Field.Wrapper>
                <NumberField label="Duration" name="duration" size="md"
                    value={start && end ? end.diff(start).as("hours") : undefined}
                    onChange={updateDuration}
                    min={0}
                />
            </Stack>
            <AutocompleteField label="Project"
                value={project}
                onChange={(e: any) => setProject(e.target.value ?? "")}
                options={options}
            />
            <Flex gap={fr(1)} justify="end" align="center">
                <Button onClick={onCancel} variant="tertiary">Cancel</Button>
                <Button onClick={submit} disabled={!canSubmit}>Save</Button>
            </Flex>
        </Stack>
    );
}