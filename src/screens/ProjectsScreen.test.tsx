import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderUI } from "../test/render";
import ProjectsScreen from "./ProjectsScreen";
import { Project } from "../data/project";

const PROJECTS: Project[] = [
    { id: "1", name: "aWall", color: "teal", description: "the wall" },
    { id: "2", name: "TSapp", color: "violet", archived: true },
];

const setup = (projects: Project[] = []) => renderUI(<ProjectsScreen />, { projects });

describe("ProjectsScreen", () => {
    it("says so when there is no project yet", () => {
        setup();
        expect(screen.getByText("No projects yet.")).toBeInTheDocument();
    });

    it("lists the projects alphabetically and marks archived ones", () => {
        setup(PROJECTS);

        const names = screen.getAllByText(/aWall|TSapp/).map(e => e.textContent);
        expect(names).toEqual(["aWall", "TSapp"]);
        expect(screen.getByText("the wall")).toBeInTheDocument();
        expect(screen.getByText("archived")).toBeInTheDocument();
    });

    it("stores a new project", () => {
        const { store } = setup();

        fireEvent.click(screen.getByRole("button", { name: "New project" }));
        fireEvent.change(screen.getByLabelText("Name"), { target: { value: "TSapp" } });
        fireEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(store.getState().projects).toMatchObject([{ name: "TSapp", color: "teal" }]);
        expect(screen.getByText("TSapp")).toBeInTheDocument();
    });

    it("opens the clicked project for editing and stores the change", () => {
        const { store } = setup(PROJECTS);

        fireEvent.click(screen.getByText("aWall"));
        fireEvent.change(screen.getByLabelText("Name"), { target: { value: "aWall 2" } });
        fireEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(store.getState().projects).toMatchObject([{ id: "1", name: "aWall 2" }, { id: "2" }]);
    });

    it("removes a deleted project", () => {
        const { store } = setup(PROJECTS);

        fireEvent.click(screen.getByText("aWall"));
        fireEvent.click(screen.getByRole("button", { name: "Delete" }));
        fireEvent.click(screen.getByRole("button", { name: "Yes" }));

        expect(store.getState().projects).toMatchObject([{ id: "2" }]);
    });
});
