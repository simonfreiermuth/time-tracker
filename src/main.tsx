import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { PRISMANE_COLORS, PrismaneProvider } from '@prismane/core'
import { createTheme } from '@prismane/core/themes';
import { useAppStore } from './data/store.ts';

function ThemeWrapper({ children }: { children: ReactNode | ReactNode[] }) {
  const mode = useAppStore(s => s.themeMode);
  let theme = createTheme({
    mode: mode,
    colors: {
      primary: { ...PRISMANE_COLORS.teal },
    },
    fontFamily: "Inter",
  });

  return (
    <PrismaneProvider theme={theme}>
      {children}
    </PrismaneProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeWrapper>
      <App />
    </ThemeWrapper>
  </React.StrictMode>,
)
