import * as React from 'react';
import {
  Stage,
  Image,
  Layer,
  Rect,
  Group,
  Star,
  Text,
  Line,
} from 'react-konva';
import useImage from 'use-image';
import { Box, Stack } from '@mui/material';

interface DataMapProps<T> {
  data: T[];
  children: any;
}

const DataMap = function <T>(props: DataMapProps<T>) {
  console.log(React.Children.toArray(props.children));
  const render: (item: T) => React.ReactElement = React.Children.only(
    props.children
  );

  return (
    <React.Fragment>{props.data.map((item) => render(item))}</React.Fragment>
  );
};

interface Props {
  imageSrc: string;
  classes: string[];
}

interface Point {
  x: number;
  y: number;
}

interface Shape {
  points: Point[];
}

const calculateSquarePoints = (start: Point, end: Point) => {
  const x1 = start.x;
  const y1 = start.y;
  const x2 = end.x;
  const y2 = end.y;

  return [
    { x: x1, y: y1 },
    { x: x2, y: y1 },
    { x: x2, y: y2 },
    { x: x1, y: y2 },
  ];
};

export const ImageAnnotation = (props: Props) => {
  const [shapes, setShapes] = React.useState<Shape[]>([]);
  const [activeShape, setActiveShape] = React.useState<number>(-1);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [image] = useImage(props.imageSrc);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer
        // onClick={handleOnLayerClick}
        onMouseMove={(event) => {
          // if (isDrawing) {
          //   const { x, y } = event.target.getStage().getPointerPosition();
          //   setPoints(calculateSquarePoints(points[0], { x, y }));
          // }
        }}
        onMouseDown={(event) => {
          // const { x, y } = event.target.getStage().getPointerPosition();
          // if (isDrawing) {
          //   setPoints(calculateSquarePoints(points[0], { x, y }));
          // } else {
          //   setIsDrawing(true);
          //   setPoints([{ x, y }]);
          // }
        }}
        onMouseUp={(event) => {
          // if (isDrawing) {
          //   setIsDrawing(false);
          // }
        }}
      >
        <Image image={image} />
        <DataMap data={shapes}>
          {(shape) => (
            <Line
              // points={points.flatMap((point) => [point.x, point.y])}
              points={[23, 20, 23, 160, 70, 93, 150, 109, 290, 139, 270, 93]}
              fill="#60224F44"
              stroke="black"
              strokeWidth={2}
              closed={true}
            />
          )}
        </DataMap>
      </Layer>
    </Stage>
  );
};

/*
type Color =
  | string
  | {
      red: number;
      green: number;
      blue: number;
      alpha: number;
    };

interface Classification {
  name: string;
  color: Color;
}

interface Props {
  imageSrc: string;
  classes: Classification[];
}

export const ImageAnnotation = (props: Props) => {
  const [image] = useImage(props.imageSrc);

  const handleOnLayerClick = (event) => {
    console.log(JSON.stringify(event, undefined, 2));
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer onClick={handleOnLayerClick}>
        <Image image={image} />
      </Layer>
    </Stage>
  );
};
*/
