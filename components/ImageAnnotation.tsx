import * as React from 'react';
import { Image, Layer, Rect, Group } from 'react-konva';
import {Box} from '@mui/material'

interface Props {
  imageSrc: string;
  classes: string[];
}

export const ImageAnnotation = ({ imageSrc, classes }) => {
  const [shapes, setShapes] = React.useState<JSX.Element[]>([]);

  const handleDraw = (className: string) => {
    // setShapes([
    //   ...shapes, (<Rect
    //     key={shapes.length}
    //     x={20}
    //     y={20}
    //     width={50}
    //     height={50}
    //     fill={className}
    //   />)
    // ]);
  };

  return (
    <Box>
     
    <Box/>
  );
};
