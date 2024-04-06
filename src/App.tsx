import { Flex, Header, PRISMANE_COLORS, PrismaneProvider, fr, Text, Modal, Tabs, Center, useThemeModeValue, Box } from '@prismane/core'
import TimeTable, { TimeTableEntry } from './components/TimeTable'
import "@fontsource/inter";
import { DateTime } from 'luxon';
import { useState } from 'react';
import TimeTableScreen from './screens/TimeTableScreen';
import { createTheme } from '@prismane/core/themes';

const theme = createTheme({
  mode: "dark",
  colors: {
    primary: { ...PRISMANE_COLORS.pink },
  },
  fontFamily: "Inter",
});

function App() {

  return (
    <>
      <PrismaneProvider theme={theme}>
        <Box mih="100vh" bg={useThemeModeValue(["base", 50], ["base", 900])}>

          <Tabs defaultValue="timeTable">
            <Tabs.List fw="bold" fs="l">
              <Tabs.Tab value="timeTable">Time table</Tabs.Tab>
              <Tabs.Tab value="projects">Projects</Tabs.Tab>
              <Tabs.Tab value="report">Report</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="timeTable"><TimeTableScreen /></Tabs.Panel>
          </Tabs>
        </Box>
      </PrismaneProvider >
    </>
  )
}

export default App
