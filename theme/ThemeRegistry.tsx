'use client';

import React, { useState, useMemo, createContext, useContext } from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// We will update your theme.ts to export this function next!
import { getCustomTheme } from './theme';

// 1. Create a Context for the color mode
interface ColorModeContextType {
  toggleColorMode: () => void;
  mode: 'light' | 'dark';
}

export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: 'dark',
});

// 2. Custom hook for easy access in other components (like your Navbar)
export const useColorMode = () => useContext(ColorModeContext);

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // --- Emotion Cache Setup (Unchanged from your original code) ---
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: 'mui' });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });
  // ---------------------------------------------------------------

  // 3. Add State for the Theme Mode (defaulting to dark)
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  // 4. Create the toggle function and memoize it
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  // 5. Generate the theme dynamically based on the current mode
  const theme = useMemo(() => getCustomTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </CacheProvider>
    </ColorModeContext.Provider>
  );
}