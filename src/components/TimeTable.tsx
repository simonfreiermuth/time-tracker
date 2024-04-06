import { Grid, fr, Text, Divider, GridItemProps, Card, usePrismaneColor, Box } from "@prismane/core";
import { range } from "../utils";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";

export interface TimeTableEntry {
    start: DateTime;
    end: DateTime;
    information?: string;
}

const hourH = 48;
const dayH = 24 * hourH;

interface EntryProps {
    entry: TimeTableEntry;
    onClick?: (entry: TimeTableEntry) => void;
}

function Entry({ entry: e, onClick }: EntryProps) {
    const top = e.start.hour * hourH;
    const duration = e.end.diff(e.start, "hours");
    const height = duration.as("hours") * hourH;

    const handleClick = onClick ? () => onClick(e) : undefined;

    return (
        <Card
            t={top} h={height} w="100%"
            bs="border-box" direction="column"
            pos="absolute" bg="primary"
            onClick={handleClick}
            sx={{
                cursor: onClick ? "pointer" : "auto",
            }}
        >
            <Text fw="bold" fs="xl" cl="white">{e.end.diff(e.start).toFormat("h:mm")}</Text>
            {e.information &&
                <Text cl="white">{e.information}</Text>
            }
        </Card>
    );
}

interface TimeTableProps {
    start: DateTime;
    days: number;
    entries: TimeTableEntry[];
    style?: React.CSSProperties;
    onClickTable?: (time: DateTime<true>) => void
    onClickEntry?: (entry: TimeTableEntry) => void
}

export default function TimeTable({ start, days: daysN, entries, style, onClickEntry, onClickTable }: TimeTableProps) {
    const ref = useRef<HTMLInputElement>(null);
    const { getColor: getColor } = usePrismaneColor();

    useEffect(() => {
        ref.current?.scrollIntoView({ block: "center" });
    }, [entries, ref.current]);

    const days = range(0, daysN)
        .map(i => start.plus({ days: i }));
    const entriesPerDay = Object
        .groupBy(entries, ({ start }) => start.day);

    const currentHour = DateTime.now().hour + (DateTime.now().minute / 60);

    const [tableClickable, setTableClickable] = useState(true);
    const handleClick = (day: DateTime<true>, event: any) => {
        if (!tableClickable || !onClickTable) return; // do not fire the event when clicking on an existing entry
        const offsetY: number = event.target.getBoundingClientRect().top;
        const y = event.clientY - offsetY;
        const h = y / hourH;
        const d = day.set({ hour: h });
        onClickTable(d);
    }

    return (
        <Grid
            templateColumns={5} gap={fr(1)}
            autoRows="auto"
            w="100%"
            h="100%"
            bs="border-box"
            sx={{
                overflowY: "scroll",
                scrollbarWidth: "thin",
                scrollbarColor: `${getColor("base")} transparent`
            }}
            style={style}
        >
            {days.map(day => (
                <Grid.Item h={10} pos="sticky" rowStart={1} t={0} key={day.day} p={fr(1)}>
                    <Text fw="bold" fs="xl">{day.toFormat("EEEE")}</Text>
                </Grid.Item>
            ))}
            {days.map((d, i) => {
                const colStart = (i >= 0 && i < 13 ? i + 1 : "auto") as GridItemProps["columnStart"];
                return (
                    <Grid.Item
                        onClick={(e: any) => handleClick(d, e)}
                        rowStart={2} rowEnd={2} columnStart={colStart} r={2}
                        h={dayH} p={fr(1)} pos="relative" key={d.day} z={10}
                        sx={{
                            cursor: onClickTable ? "pointer" : "auto",
                        }}>
                        {entriesPerDay[d.day]?.map((e, i) => (
                            <Box w="max-content" h="max-content" key={i} p={0} m={0}
                                onMouseEnter={() => setTableClickable(false)}
                                onMouseLeave={() => setTableClickable(true)}
                            >
                                <Entry
                                    entry={e}
                                    onClick={onClickEntry}
                                    key={i}
                                />
                            </Box>
                        ))}
                    </Grid.Item>
                )
            })}
            <Grid.Item rowStart={2} rowEnd={2} columnStart={1} columnSpan="full" pos="relative" z={0} >
                <Divider bdc="Highlight" t={hourH * currentHour} pos="absolute" ref={ref} />
            </Grid.Item>
        </Grid>
    )
}