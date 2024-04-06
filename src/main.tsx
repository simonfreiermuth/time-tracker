import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { PRISMANE_COLORS, PrismaneProvider } from '@prismane/core'
import { createTheme } from '@prismane/core/themes';

const theme = createTheme({
  mode: "dark",
  colors: {
    primary: { ...PRISMANE_COLORS.teal },
  },
  fontFamily: "Inter",
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrismaneProvider theme={theme}>
      <App />
    </PrismaneProvider>
  </React.StrictMode>,
)
