import { Flex, Header, PRISMANE_COLORS, PrismaneProvider, fr, Text, Modal } from '@prismane/core'
import TimeTable, { TimeTableEntry } from './components/TimeTable'
import "@fontsource/inter";
import { DateTime } from 'luxon';
import { useState } from 'react';

function App() {
  const theme = {
    colors: {
      primary: { ...PRISMANE_COLORS.pink },
    },
    fontFamily: "Inter"
  };
  const entries: TimeTableEntry[] = [
    { start: DateTime.local(2024, 4, 1, 8), end: DateTime.local(2024, 4, 1, 12), information: "TSapp" },
    { start: DateTime.local(2024, 4, 1, 13), end: DateTime.local(2024, 4, 1, 18) },
    { start: DateTime.local(2024, 4, 2, 8), end: DateTime.local(2024, 4, 2, 11) },
  ];

  const [modalEntry, setModalEntry] = useState<TimeTableEntry|undefined>(undefined);

  return (
    <>
      <PrismaneProvider theme={theme}>
        <Header>
          <Text as="h1">Time Table</Text>
        </Header>
        <Flex h="80vh" p={fr(4)} bs="border-box">
          <TimeTable
            start={DateTime.local(2024, 4, 1)}
            days={5}
            entries={entries}
            onClick={(e) => setModalEntry(e)}
          />
        </Flex>
        <Modal open={modalEntry ? true : false} onClose={() => setModalEntry(undefined)} closable>
          <Text>{JSON.stringify(modalEntry)}</Text>
        </Modal>
      </PrismaneProvider >
    </>
  )
}

export default App
