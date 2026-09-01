import { Tabs, Box, useThemeModeValue, Flex } from "@prismane/core"
import "@fontsource/inter";
import TimeTableScreen from "./screens/TimeTableScreen";
import HeaderBar from "./components/HeaderBar";
import { CalendarIcon, FileIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { useMediaQuery } from "@prismane/core/hooks";

function App() {
  const background = useThemeModeValue(["base", 50], ["base", 900]);
  const tabsBackground = useThemeModeValue(["base", 100], ["base", 800]);
  const isMobile = useMediaQuery("(max-width: 768px)"); // TODO generalize media queries

  return (
    <Box h="100vh" bg={background} of="hidden">
      <HeaderBar dataSwitch />
      <Tabs defaultValue="calendar" variant="filled" direction={isMobile ? "column" : "row"}>
        <Flex direction={isMobile ? "row" : "column"} fs="s" align="stretch" bg={tabsBackground} sx={isMobile ? {
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 100
        }:{}} >
          <Tabs.Tab value="calendar" direction="column" align="center" justify="center" w="100%" bs="border-box">
            <CalendarIcon size={32} />
            Calendar
          </Tabs.Tab>
          <Tabs.Tab value="projects" direction="column" align="center" justify="center" w="100%" bs="border-box">
            <SquaresFourIcon size={32} />
            Projects
          </Tabs.Tab>
          <Tabs.Tab value="report" direction="column" align="center" justify="center" w="100%" bs="border-box">
            <FileIcon size={32} />
            Report
          </Tabs.Tab>
        </Flex>
        <Tabs.Panel value="calendar"><TimeTableScreen /></Tabs.Panel>
      </Tabs>
    </Box>
  );
}

export default App
