import { Grid, fr, Text, Divider, GridItemProps, Card, usePrismaneColor, Box, useThemeModeValue, Stack } from "@prismane/core";
import { range } from "../utils";
import { DateTime } from "luxon";
import { useState } from "react";
import { TimeTableEntry, getDuration } from "../data/entry";

const HOUR_H = 48;
const DAY_H = 25 * HOUR_H;

interface EntryProps {
    entry: TimeTableEntry;
    onClick?: (entry: TimeTableEntry) => void;
}

function Entry({ entry: e, onClick }: EntryProps) {
    const top = e.start.hour * HOUR_H;
    const duration = getDuration(e);
    const height = duration.as("hours") * HOUR_H;

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
            <Stack direction="row" align="baseline">
                <Text fw="bold" fs="xl" cl="white">
                    {duration.toFormat("h:mm")}
                </Text>
                <Text cl="white">
                    houers
                </Text>
            </Stack>
            {e.project &&
                <Text cl="white">{e.project}</Text>
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
    const { getColor: getColor } = usePrismaneColor();
    const background = useThemeModeValue(["base", 50, 0.5], ["base", 900, 0.5]);

    const days = range(0, daysN)
        .map(i => start.plus({ days: i }));
    const entriesPerDay = Object
        .groupBy(
            // only show this weeks entries
            // TODO this implementation assumes weeks. Maybe checking weither the table range (start + daysN) overlaps the entry range (start..end)
            entries.filter(({ start: e }) => e.weekNumber === start.weekNumber && e.weekYear === start.weekYear),
            ({ start }) => start.day);

    const currentHour = DateTime.now().hour + (DateTime.now().minute / 60);

    const [tableClickable, setTableClickable] = useState(true);
    const handleClick = (day: DateTime<true>, event: any) => {
        if (!tableClickable || !onClickTable) return; // do not fire the event when clicking on an existing entry
        const offsetY: number = event.target.getBoundingClientRect().top;
        const y = event.clientY - offsetY;
        const h = y / HOUR_H;
        const d = day.set({ hour: h });
        onClickTable(d);
    };

    const lineColor = useThemeModeValue(["base", 200], ["base", 800]);

    return (
        <Grid
            templateColumns={6} gap={fr(1)}
            autoRows="auto"
            w="100%"
            h="100%"
            bs="border-box"
            sx={{
                overflowY: "scroll",
                scrollbarWidth: "thin",
                scrollbarColor: `${getColor("base")} transparent`,
                gridTemplateColumns: "max-content repeat(5, 1fr)"
            }}
            style={style}
            id="timetable"
        >
            <Grid.Item rowStart={1} columnStart={1}></Grid.Item>
            {days.map(day => (
                <Grid.Item pos="sticky" rowStart={1} t={0} key={day.day} p={fr(1)} z={100} bg={background} sx={{ backdropFilter: "blur(4px)", marginLeft: "-2px", marginRight: "-2px" }} >
                    <Text fw="bold" fs="xl">{day.toFormat("EEEE")}</Text>
                </Grid.Item>
            ))}
            {days.map((d, i) => {
                const colStart = (i >= 0 && i < 13 ? i + 2 : "auto") as GridItemProps["columnStart"];
                return (
                    <Grid.Item
                        onClick={(e: any) => handleClick(d, e)}
                        rowStart={2} rowEnd={2} columnStart={colStart} r={2}
                        h={DAY_H} pos="relative" key={d.day} z={10}
                        miw={fr(32)}
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
            <Grid.Item rowStart={2} rowEnd={2} columnStart={1} columnSpan="full" pos="relative" p={0} z={0} >
                {range(0, 24).map(h =>
                    <Divider t={h * HOUR_H} bdc={lineColor} pos="absolute" key={h} />
                )}
                <Divider id="current-time-line" bdc="Highlight" t={HOUR_H * currentHour} pos="absolute" />
            </Grid.Item>
            <Grid.Item rowStart={2} rowEnd={2} columnStart={1} p={0}>
                {range(0, 25).map(h => {
                    const houer = DateTime.now().set({ hour: h, minute: 0 }).toFormat("HH:mm");
                    return (
                        <Box h={HOUR_H} key={h} p={fr(1)} bs="border-box" >
                            <Text>{houer}</Text>
                        </Box>
                    )
                })}
            </Grid.Item>
        </Grid>
    )
}