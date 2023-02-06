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
  Stack,
  Paper,
  Divider,
  CardMedia,
  CardContent,
} from '@mui/material';
import { ImageAnnotation } from '../components/ImageAnnotation';

export default function Root() {
  return (
    <Paper variant="outlined" sx={{ m: 1, overflow: 'hidden', maxHeight: 'calc(100vh - 80px)' }}>
      <Stack direction="row">
        <ImageAnnotation
          imageSrc="https://d7pdsiqo9rcig.cloudfront.net/wp-content/uploads/2019/11/Receipt-OCR-Taggun-demo.png"
          classes={[]}
        />
        <Divider orientation="vertical" flexItem />
        {/* <ImageAnnotation /> */}
      </Stack>
    </Paper>
  );
}
