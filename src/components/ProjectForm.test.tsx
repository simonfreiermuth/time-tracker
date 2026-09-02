import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderUI } from "../test/render";
import ProjectForm from "./ProjectForm";
import { Project } from "../data/project";

const AWALL: Project = { id: "1", name: "aWall", color: "teal", description: "the wall" };

function setup(props: Partial<React.ComponentProps<typeof ProjectForm>> = {}) {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    const rendered = renderUI(
        <ProjectForm title="New project" taken={[]} onSubmit={onSubmit} onCancel={onCancel} {...props} />
    );
    return { onSubmit, onCancel, ...rendered };
}

const type = (label: string, value: string) =>
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));

describe("ProjectForm", () => {
    it("needs a name before it can be saved", () => {
        setup();
        expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
        type("Name", "TSapp");
        expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
    });

    it("creates a project with colour and description", () => {
        const f = setup();
        type("Name", "  TSapp  ");
        click("violet");
        type("Description", "the app");
        click("Save");

        expect(f.onSubmit).toHaveBeenCalledOnce();
        expect(f.onSubmit.mock.calls[0][0]).toMatchObject({
            name: "TSapp", color: "violet", description: "the app",
        });
    });

    it("marks the selected colour", () => {
        setup();
        click("violet");
        expect(screen.getByRole("button", { name: "violet" })).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByRole("button", { name: "teal" })).toHaveAttribute("aria-pressed", "false");
    });

    it("rejects a name another project already uses, ignoring case", () => {
        setup({ taken: ["aWall"] });
        type("Name", "AWALL");

        expect(screen.getByText("Already used")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    });

    it("prefills and updates an existing project", () => {
        const f = setup({ project: AWALL, title: "Edit project" });
        expect(screen.getByLabelText("Name")).toHaveValue("aWall");
        expect(screen.getByLabelText("Description")).toHaveValue("the wall");
        expect(screen.getByLabelText("Archived")).not.toBeChecked();

        fireEvent.click(screen.getByLabelText("Archived"));
        expect(screen.getByLabelText("Archived")).toBeChecked();
        expect(document.querySelector(".PrismaneSwitch-root-active")).toBeInTheDocument();
        click("Save");

        expect(f.onSubmit.mock.calls[0][0]).toMatchObject({ id: "1", name: "aWall", archived: true });
    });

    it("deletes only after confirmation", () => {
        const onDelete = vi.fn();
        setup({ project: AWALL, onDelete });

        click("Delete");
        expect(onDelete).not.toHaveBeenCalled();

        const dialog = screen.getByTestId("prismane-dialog");
        fireEvent.click(within(dialog).getByRole("button", { name: "Yes" }));
        expect(onDelete).toHaveBeenCalledWith(AWALL);
    });
});
