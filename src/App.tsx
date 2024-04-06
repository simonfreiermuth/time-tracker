import { Tabs, Box, useThemeModeValue, Flex, Text } from '@prismane/core'
import "@fontsource/inter";
import TimeTableScreen from './screens/TimeTableScreen';
import HeaderBar from './components/HeaderBar';
import { Calendar, File, SquaresFour } from '@phosphor-icons/react';

function App() {
  const background = useThemeModeValue(["base", 50], ["base", 900]);
  const tabsBackground = useThemeModeValue(["base", 100], ["base", 800]);

  return (
    <>
      <Box mih="100vh" bg={background}>
        <HeaderBar />
        <Tabs defaultValue="calendar" variant="filled" direction="row">
          <Flex direction="column" fs="s" align="stretch" bg={tabsBackground} >
            <Tabs.Tab value="calendar" direction="column" align="center" justify="center" w="100%" bs="border-box">
              <Calendar size={32} />
              Calendar
            </Tabs.Tab>
            <Tabs.Tab value="projects" direction="column" align="center" justify="center" w="100%" bs="border-box">
              <SquaresFour size={32} />
              Projects
            </Tabs.Tab>
            <Tabs.Tab value="report" direction="column" align="center" justify="center" w="100%" bs="border-box">
              <File size={32} />
              Report
            </Tabs.Tab>
          </Flex>
          <Tabs.Panel value="calendar"><TimeTableScreen /></Tabs.Panel>
        </Tabs>
      </Box>
    </>
  )
}

export default App
