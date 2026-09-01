import { Badge, Button, Card, Center, Modal, Square, Stack, Text, fr } from "@prismane/core";
import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Project } from "../data/project";
import { useDataStore } from "../data/useDataStore";
import ProjectForm from "../components/ProjectForm";

export default function ProjectsScreen() {
    const projects = useDataStore(s => s.projects);
    const addProject = useDataStore(s => s.addProject);
    const updateProject = useDataStore(s => s.updateProject);
    const deleteProject = useDataStore(s => s.deleteProject);

    /** `undefined` = closed, `null` = creating a new one. */
    const [editing, setEditing] = useState<Project | null>();

    const close = () => setEditing(undefined);
    const submit = (project: Project) => {
        if (editing) updateProject(project); else addProject(project);
        close();
    };
    const remove = (project: Project) => {
        deleteProject(project);
        close();
    };

    const sorted = [...projects].sort((a, b) => a.name.localeCompare(b.name));
    const taken = projects
        .filter(p => p.id !== editing?.id)
        .map(p => p.name);

    return (
        <Stack w="100%" p={fr(4)} gap={fr(2)} bs="border-box">
            <Button icon={<PlusIcon />} onClick={() => setEditing(null)} ml="auto">New project</Button>
            {sorted.length === 0 &&
                <Center p={fr(8)}>
                    <Text cl={["base", 500]}>No projects yet.</Text>
                </Center>
            }
            {sorted.map(p => (
                <Card key={p.id} direction="row" align="center" gap={fr(3)} p={fr(3)} w="100%"
                    cs="pointer" onClick={() => setEditing(p)}>
                    <Square size={fr(8)} br="full" bg={[p.color, 500]} />
                    <Stack gap={fr(1)}>
                        <Text fw="bold">{p.name}</Text>
                        {p.description && <Text fs="sm" cl={["base", 500]}>{p.description}</Text>}
                    </Stack>
                    {p.archived && <Badge ml="auto" color="base">archived</Badge>}
                </Card>
            ))}
            <Modal open={editing !== undefined} of="visible" onClose={close} closable>
                <ProjectForm
                    project={editing ?? undefined}
                    taken={taken}
                    title={editing ? "Edit project" : "New project"}
                    onSubmit={submit}
                    onCancel={close}
                    onDelete={editing ? remove : undefined}
                />
            </Modal>
        </Stack>
    );
}
