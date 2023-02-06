import * as React from 'react';
import {
  createTheme,
  ThemeProvider,
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  PaletteMode,
  Typography,
  IconButton,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root';
import ErrorPage from './ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
]);

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

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box>
          <AppBar disableGutters>
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Dataset Annotator
              </Typography>
              <IconButton
                sx={{ ml: 1 }}
                onClick={colorMode.toggleColorMode}
                color="inherit"
              >
                {theme.palette.mode === 'dark' ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </IconButton>
            </Toolbar>
          </AppBar>
          <Toolbar />
          <RouterProvider router={router} />
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
