import { Box, Grid, fr, Text, Flex, NumberField, Divider, GridItemProps, Card } from "@prismane/core";
import { range } from "../utils";
import { DateTime, Duration } from "luxon";
import { useEffect, useRef, useState } from "react";

export interface TimeTableEntry {
    start: DateTime;
    end: DateTime;
    information?: string
}

interface TimeTableProps {
    start: DateTime;
    days: number;
    entries: TimeTableEntry[];
    style?: React.CSSProperties;
}

const hourH = 48;
const dayH = 24 * hourH;

function Entry({ entry: e }: { entry: TimeTableEntry }) {
    const top = e.start.hour * hourH;
    const duration = e.end.diff(e.start, "hours");
    const height = duration.as("hours") * hourH;

    return (
        <Card t={top} h={height} bs="border-box" direction="column" w="100%" pos="absolute" bg="primary">
            <Text fw="bold" fs="xl" cl="white">{e.end.diff(e.start).toFormat("h:mm")}</Text>
            {e.information &&
                <Text cl="white">{e.information}</Text>
            }
        </Card>
    );
}

export default function TimeTable({ start, days: daysN, entries, style }: TimeTableProps) {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        console.log("scroll...", ref.current);
        ref.current?.scrollIntoView({block: "center"});
    }, [entries, ref.current]);

    const days = range(0, daysN)
        .map(i => start.plus({ days: i }));
    const entriesPerDay = Object
        .groupBy(entries, ({ start }) => start.day);
    
    const currentHour = DateTime.now().hour + (DateTime.now().minute / 60);

    return (
        <Grid
            templateColumns={5} gap={fr(1)}
            autoRows="auto"
            w="100%"
            h="100%"
            bs="border-box"
            sx={{ overflowY: "scroll" }}
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
                    <Grid.Item rowStart={2} rowEnd={2} columnStart={colStart} r={2} h={dayH} p={fr(1)} pos="relative" key={d.day} >
                        {entriesPerDay[d.day]?.map((e, i) => (
                            <Entry entry={e} key={i} />
                        ))}
                    </Grid.Item>
                )
            })}
            <Grid.Item rowStart={2} rowEnd={2} columnStart={1} columnSpan="full" pos="relative">
                <Divider bdc="Highlight" t={hourH*currentHour} pos="absolute" ref={ref} />
            </Grid.Item>
        </Grid>
    )
}