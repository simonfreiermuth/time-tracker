import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { DateTime } from "luxon";
import { renderUI } from "../test/render";
import EntryForm from "./EntryForm";
import { TimeTableEntry } from "../data/entry";

/** The slot the user clicked in the time table. */
const CLICKED = DateTime.fromISO("2026-09-01T14:30");

const EXISTING: TimeTableEntry = {
    id: "abc",
    start: DateTime.fromISO("2026-09-01T09:00"),
    end: DateTime.fromISO("2026-09-01T11:30"),
    project: "aWall",
};

function setup(props: Partial<React.ComponentProps<typeof EntryForm>> = {}) {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    const rendered = renderUI(
        <EntryForm
            title="Create new entry"
            date={CLICKED}
            start={CLICKED}
            onSubmit={onSubmit}
            onCancel={onCancel}
            {...props}
        />
    );
    const fields = {
        date: () => screen.getByLabelText("Date"),
        start: () => screen.getByLabelText("Start"),
        end: () => screen.getByLabelText("End"),
        duration: () => screen.getByLabelText("Duration"),
        project: () => screen.getByLabelText("Project"),
        save: () => screen.getByRole("button", { name: "Save" }),
    };
    return { onSubmit, onCancel, ...fields, ...rendered };
}

/** Date and time inputs are only settable as a whole. */
const setValue = (input: HTMLElement, value: string) =>
    fireEvent.change(input, { target: { value } });

describe("EntryForm — creating an entry", () => {
    it("prefills date and start from the clicked slot", () => {
        const f = setup();
        expect(f.date()).toHaveValue("2026-09-01");
        expect(f.start()).toHaveValue("14:30");
        expect(f.end()).toHaveValue("");
    });

    it("keeps Save disabled until the entry has an end", () => {
        const f = setup();
        expect(f.save()).toBeDisabled();
        setValue(f.end(), "16:00");
        expect(f.save()).toBeEnabled();
    });

    it("submits start and end", () => {
        const f = setup();
        setValue(f.end(), "16:00");
        fireEvent.click(f.save());

        expect(f.onSubmit).toHaveBeenCalledOnce();
        const entry: TimeTableEntry = f.onSubmit.mock.calls[0][0];
        expect(entry.start.toISO()).toBe(CLICKED.toISO());
        expect(entry.end.toFormat("yyyy-MM-dd HH:mm")).toBe("2026-09-01 16:00");
    });

    it("shows the duration resulting from start and end", () => {
        const f = setup();
        setValue(f.end(), "16:00");
        expect(f.duration()).toHaveValue(1.5);
    });

    it("lets the user type a duration instead of an end time", async () => {
        const f = setup();
        await f.user.type(f.duration(), "2");

        expect(f.end()).toHaveValue("16:30");
        fireEvent.click(f.save());
        expect(f.onSubmit.mock.calls[0][0].end.toFormat("HH:mm")).toBe("16:30");
    });

    it("accepts fractional durations", async () => {
        const f = setup();
        await f.user.type(f.duration(), "1.75");
        expect(f.end()).toHaveValue("16:15");
    });

    it("survives an emptied duration without submitting garbage", async () => {
        const f = setup();
        await f.user.type(f.duration(), "2");
        await f.user.clear(f.duration());

        expect(f.end()).toHaveValue("");
        expect(f.save()).toBeDisabled();
    });

    it("does not accept an end before the start", () => {
        const f = setup();
        setValue(f.end(), "13:00");
        expect(f.save()).toBeDisabled();
    });

    it("moves start and end along when the date changes", () => {
        const f = setup();
        setValue(f.end(), "16:00");
        setValue(f.date(), "2026-09-03");
        fireEvent.click(f.save());

        const entry: TimeTableEntry = f.onSubmit.mock.calls[0][0];
        expect(entry.start.toFormat("yyyy-MM-dd HH:mm")).toBe("2026-09-03 14:30");
        expect(entry.end.toFormat("yyyy-MM-dd HH:mm")).toBe("2026-09-03 16:00");
    });

    it("submits the typed project", async () => {
        const f = setup();
        setValue(f.end(), "16:00");
        await f.user.type(f.project(), "TSapp");
        fireEvent.click(f.save());

        expect(f.onSubmit.mock.calls[0][0].project).toBe("TSapp");
    });

    it("cancels without submitting", () => {
        const f = setup();
        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

        expect(f.onCancel).toHaveBeenCalledOnce();
        expect(f.onSubmit).not.toHaveBeenCalled();
    });
});

describe("EntryForm — editing an entry", () => {
    const edit = (onDelete?: (e: TimeTableEntry) => void) =>
        setup({ title: "Edit entry", entry: EXISTING, date: undefined, start: undefined, onDelete });

    it("prefills every field from the entry", () => {
        const f = edit();
        expect(f.date()).toHaveValue("2026-09-01");
        expect(f.start()).toHaveValue("09:00");
        expect(f.end()).toHaveValue("11:30");
        expect(f.duration()).toHaveValue(2.5);
        expect(f.project()).toHaveValue("aWall");
    });

    it("keeps the id when updating", () => {
        const f = edit();
        setValue(f.start(), "10:00");
        fireEvent.click(f.save());

        const entry: TimeTableEntry = f.onSubmit.mock.calls[0][0];
        expect(entry.id).toBe(EXISTING.id);
        expect(entry.start.toFormat("HH:mm")).toBe("10:00");
        expect(entry.end.toFormat("HH:mm")).toBe("11:30");
    });

    it("deletes only after confirmation", () => {
        const onDelete = vi.fn();
        edit(onDelete);

        fireEvent.click(screen.getByRole("button", { name: "Delete" }));
        expect(onDelete).not.toHaveBeenCalled();

        const dialog = screen.getByTestId("prismane-dialog");
        fireEvent.click(within(dialog).getByRole("button", { name: "Yes" }));
        expect(onDelete).toHaveBeenCalledWith(EXISTING);
    });
});
