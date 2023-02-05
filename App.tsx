import * as React from 'react';
import {
  createTheme,
  ThemeProvider,
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  PaletteMode,
} from '@mui/material';

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

export const App = () => {
  const [mode, setMode] = React.useState<PaletteMode>('dark');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light'
        );
      },
    }),
    []
  );

  const theme = React.useMemo(() => createTheme(), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box>
          <AppBar disableGutters>
            <Toolbar dense></Toolbar>
          </AppBar>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
