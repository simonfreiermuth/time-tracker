/** Colours a project can be shown in — a subset of the Prismane palette. */
export const PROJECT_COLORS = [
    "teal", "blue", "violet", "magenta", "ruby", "orange", "yellow", "green",
] as const;

export type ProjectColor = typeof PROJECT_COLORS[number];

export interface Project {
    id: string;
    name: string;
    color: ProjectColor;
    description?: string;
    archived?: boolean;
}

/** Create a new `Project` with a random id. */
export function createProject(name: string, color: ProjectColor, description?: string): Project {
    return {
        id: crypto.randomUUID(),
        name: name.trim(),
        color: color,
        description: description?.trim() || undefined,
    };
}

/** The colour to show an entry in, falling back to the theme's primary. */
export function colorOf(projects: Project[], name?: string): ProjectColor | "primary" {
    return projects.find(p => p.name === name)?.color ?? "primary";
}
