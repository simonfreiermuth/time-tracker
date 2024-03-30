import { Box, Grid, fr } from "@prismane/core";

export default function TimeTable() {
    const days = ["monday", "tuesday", "weensy", "thursday", "friday" ];
    const hourH = 48;
    const dayH = 24*hourH;

    return (
        <Grid 
            templateColumns={5} gap={fr(1)} 
            w="100vw"
            mah="100vh"
            of="scroll"
        >
            {days.map(day => (
                <Grid.Item p={fr(1)}>{day}</Grid.Item>
            ))}
            {days.map(_ => (
                <Grid.Item h={dayH} p={fr(1)}>
                    <Box w="100%" pos="relative" t={48} h={hourH} bg="primary" />
                    <Box w="100%" pos="relative" t={120} h={hourH} bg="primary" />
                </Grid.Item>
            ))}
        </Grid>
    )
}