import { PRISMANE_COLORS, PrismaneProvider } from '@prismane/core'
import TimeTable from './components/TimeTable'
import "@fontsource/inter";

function App() {
  const theme = {
    colors: {
      primary: {...PRISMANE_COLORS.pink},
    }
  }

  return (
    <PrismaneProvider theme={theme}>
      <TimeTable />
    </PrismaneProvider>
  )
}

export default App
