import { Field, Form, NumberField, SelectField, Stack } from "@prismane/core";
import { TimeTableEntry } from "./TimeTable";
import { useState } from "react";

export default function EntryForm({ entry }: { entry: TimeTableEntry }) {
    const [start, setStart] = useState(entry.start);
    const [end, setEnd] = useState(entry.end);

    const updateStart = (event: any) => {
        const [hour, minute] = event.target.value
            .split(":")
            .map((s: string) => parseInt(s));
        setStart(start.set({ hour: hour, minute: minute }));
    };
    const updateEnd = (event: any) => {
        const [hour, minute] = event.target.value
            .split(":")
            .map((s: string) => parseInt(s));
        setEnd(end.set({ hour: hour, minute: minute }));
    }
    const updateDuration = (event: any) => {
        const h = parseInt(event.target.value);
        setEnd(start.plus({hours: h}))
    }

    return (
        <Form>
            <Field.Wrapper>
                <SelectField options={[]} />
                <Field.Label>Project</Field.Label>
            </Field.Wrapper>
            <Stack direction="row">
                <Field.Wrapper>
                    <Field value={start.toFormat("hh:mm")} onChange={updateStart} type="time" name="start" size="xs" />
                    <Field.Label>Start</Field.Label>
                </Field.Wrapper>
                <Field.Wrapper>
                    <Field value={end.toFormat("hh:mm")} onChange={updateEnd} type="time" name="end" size="xs" />
                    <Field.Label>End</Field.Label>
                </Field.Wrapper>
                <Field.Wrapper>
                    <NumberField value={end.diff(start).as("hours")} onChange={updateDuration} name="duration" size="md" />
                    <Field.Label >duration</Field.Label>    
                </Field.Wrapper>
            </Stack>
        </Form>
    )
}