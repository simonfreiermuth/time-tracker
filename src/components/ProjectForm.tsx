import { Button, Dialog, Field, Flex, Square, Stack, Switch, Text, TextField, TextareaField, fr } from "@prismane/core";
import { ChangeEvent, useState } from "react";
import { PROJECT_COLORS, Project, ProjectColor, createProject } from "../data/project";

interface ProjectFormProps {
    project?: Project;
    /** Names already taken by other projects. */
    taken: string[];
    title: string;
    onSubmit: (project: Project) => void;
    onCancel: () => void;
    onDelete?: (project: Project) => void;
}

export default function ProjectForm({ project, taken, title, onSubmit, onCancel, onDelete }: ProjectFormProps) {
    const [name, setName] = useState(project?.name ?? "");
    const [color, setColor] = useState<ProjectColor>(project?.color ?? PROJECT_COLORS[0]);
    const [description, setDescription] = useState(project?.description ?? "");
    const [archived, setArchived] = useState(project?.archived ?? false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const trimmed = name.trim();
    const nameError = !trimmed
        ? undefined // nothing typed yet, just keep Save disabled
        : taken.some(t => t.toLowerCase() === trimmed.toLowerCase())
            ? "Already used"
            : undefined;
    const canSubmit = !!trimmed && !nameError;

    const submit = () => {
        if (!canSubmit) return;
        onSubmit(project
            ? { ...project, name: trimmed, color: color, description: description.trim() || undefined, archived: archived }
            : { ...createProject(trimmed, color, description), archived: archived });
    };

    const doDelete = () => {
        if (onDelete && project) onDelete(project);
        setDeleteOpen(false);
    };

    return (
        <>
            <Stack direction="column" gap={fr(2)} of="visible" miw={fr(80)}>
                <Text as="h2">{title}</Text>
                <TextField label="Name" name="name" value={name} error={nameError}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                <Field.Wrapper>
                    <Field.Label>Colour</Field.Label>
                    <Flex gap={fr(1)} wrap="wrap">
                        {PROJECT_COLORS.map(c => (
                            <Square key={c} size={fr(8)} br="full" bg={[c, 500]} cs="pointer"
                                aria-label={c} aria-pressed={c === color} role="button"
                                bdw={2} bdc={c === color ? ["base", 900] : "transparent"}
                                onClick={() => setColor(c)} />
                        ))}
                    </Flex>
                </Field.Wrapper>
                <TextareaField label="Description" name="description" value={description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} />
                <Switch label="Archived" name="archived" checked={archived}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setArchived(e.target.checked)} />
                <Flex gap={fr(1)} align="center">
                    {onDelete && <Button onClick={() => setDeleteOpen(true)} variant="tertiary">Delete</Button>}
                    <Button onClick={onCancel} variant="tertiary" ml="auto">Cancel</Button>
                    <Button onClick={submit} disabled={!canSubmit}>Save</Button>
                </Flex>
            </Stack>
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} position="bottom" animation="slide-down" closable>
                <Dialog.Header>
                    <Text as="h2">Delete project</Text>
                </Dialog.Header>
                <Text>Existing entries keep the project name. Delete it from the list?</Text>
                <Dialog.Footer gap={fr(1)} justify="end">
                    <Button onClick={doDelete} variant="tertiary">Yes</Button>
                    <Button onClick={() => setDeleteOpen(false)}>No</Button>
                </Dialog.Footer>
            </Dialog>
        </>
    );
}
