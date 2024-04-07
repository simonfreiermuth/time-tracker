import { AutocompleteField, Button, Field, Flex, NumberField, Stack, Text, fr } from "@prismane/core";
import { TimeTableEntry } from "./TimeTable";
import { useState } from "react";

export default function EntryForm({ entry }: { entry: TimeTableEntry }) {
    /* implementation note:
    The useForm hook is not used to prevent type information loss and 
    calculations (duration) are done ad hoc so handling data as strings is 
    not very suitable here.*/
    const [project, setProject] = useState(entry.project ?? "");
    const [start, setStart] = useState(entry.start);
    const [end, setEnd] = useState(entry.end);

    const projects = ["TSapp", "ITmeetsOT", "aWall"]; // TODO replace with actual store data
    const options = projects.map(p => ({
        value: p,
        element: p
    }));

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
        setEnd(start.plus({ hours: h }))
    }

    return (
        <Stack direction="column" gap={fr(2)}>
            <Text as="h2">Edit entry</Text>
            <AutocompleteField label="Project"
                value={project}
                onChange={(e: any) => setProject(e.target.value ?? "")}
                options={options}
            />
            <Stack direction="row">
                <Field.Wrapper>
                    <Field.Label>Start</Field.Label>
                    <Field value={start.toFormat("hh:mm")} onChange={updateStart} type="time" name="start" size="xs" />
                </Field.Wrapper>
                <Field.Wrapper>
                    <Field.Label>End</Field.Label>
                    <Field value={end.toFormat("hh:mm")} onChange={updateEnd} type="time" name="end" size="xs" />
                </Field.Wrapper>
                <NumberField label="Duration" value={end.diff(start).as("hours")} onChange={updateDuration} name="duration" size="md" />
            </Stack>
            <Flex gap={fr(1)} justify="end" align="center">
                <Button type="reset" variant="tertiary">Cancel</Button>
                <Button type="submit">Save</Button>
            </Flex>
        </Stack>
    );
}