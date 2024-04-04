import { Flex, Header, PRISMANE_COLORS, PrismaneProvider, fr, Text, Modal, Tabs } from '@prismane/core'
import TimeTable, { TimeTableEntry } from './components/TimeTable'
import "@fontsource/inter";
import { DateTime } from 'luxon';
import { useState } from 'react';
import TimeTableScreen from './screens/TimeTableScreen';

function App() {
  const theme = {
    colors: {
      primary: { ...PRISMANE_COLORS.pink },
    },
    fontFamily: "Inter"
  };
  const [modalEntry, setModalEntry] = useState<TimeTableEntry | undefined>(undefined);

  return (
    <>
      <PrismaneProvider theme={theme}>
        <Header>
          <Text as="h1">Time Table</Text>
        </Header>
        <Tabs defaultValue="timeTable">
          <Tabs.List>
            <Tabs.Tab value="timeTable">Time table</Tabs.Tab>
            <Tabs.Tab value="projects">Projects</Tabs.Tab>
            <Tabs.Tab value="report">Report</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="timeTable"><TimeTableScreen/></Tabs.Panel>
        </Tabs>
      </PrismaneProvider >
    </>
  )
}

export default App
