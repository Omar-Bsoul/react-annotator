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
import { Box, Stack, Paper, Button, Typography } from '@mui/material';

interface DataMapProps<T> {
  data: T[];
  children: (item: T, i: number) => React.ReactElement;
}

const DataMap = function <T>(props: DataMapProps<T>) {
  return <React.Fragment>{props.data.map(props.children)}</React.Fragment>;
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

const calculateSquarePoints = (
  start: Point,
  end: Point,
  sort: boolean = false
) => {
  const x1 = sort ? Math.min(start.x, end.x) : start.x;
  const y1 = sort ? Math.min(start.y, end.y) : start.y;
  const x2 = sort ? Math.max(start.x, end.x) : end.x;
  const y2 = sort ? Math.max(start.y, end.y) : end.y;

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
  const [enableDrawing, setEnableDrawing] = React.useState(true);
  const [image] = useImage(props.imageSrc);

  React.useEffect(() => {
    console.log(shapes);
  }, [shapes]);

  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <Button onClick={() => setEnableDrawing(!enableDrawing)}>
          Toggle Drawing
        </Button>
        <Typography>
          {enableDrawing ? 'Drawing Enabled' : 'Drawing Disabled'}
        </Typography>
      </Stack>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer
          onMouseMove={(event) => {
            if (isDrawing) {
              const currentPoint: Point = event.target
                .getStage()
                .getPointerPosition();

              const currentShape = {
                points: shapes[activeShape].points.map((point) => ({
                  x: point.x,
                  y: point.y,
                })),
              };

              currentShape.points = calculateSquarePoints(
                currentShape.points[0],
                currentPoint
              );

              setShapes(shapes);

              setShapes([...shapes.slice(0, shapes.length - 1), currentShape]);
            }
          }}
          onMouseDown={(event) => {
            const currentPoint: Point = event.target
              .getStage()
              .getPointerPosition();

            if (enableDrawing) {
              setActiveShape(shapes.length);
              setIsDrawing(true);
              setShapes([...shapes, { points: [currentPoint] }]);
            } else {
              // console.log(event.target.getAncestors()[0].findAncestor());
            }
          }}
          onMouseUp={(event) => {
            if (isDrawing) {
              const currentPoint: Point = event.target
                .getStage()
                .getPointerPosition();

              setActiveShape(-1);
              setIsDrawing(false);
              setShapes([
                ...shapes.slice(0, shapes.length - 1),
                {
                  points: calculateSquarePoints(
                    shapes[shapes.length - 1].points[0],
                    currentPoint,
                    true
                  ),
                },
              ]);
            }
          }}
        >
          <Image image={image} />
          <DataMap data={shapes}>
            {(shape, i) => (
              <Line
                key={i}
                points={shape.points.flatMap((point) => [point.x, point.y])}
                fill="#60224F44"
                stroke="black"
                strokeWidth={2}
                closed={true}
                id={i.toString()}
                onMouseDown={(event) => {
                  const currentPoint: Point = event.target
                    .getStage()
                    .getPointerPosition();

                  const distanceCalc = (a: Point, b: Point) => {
                    return Math.sqrt(
                      Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)
                    );
                  };

                  const distanceObj = [
                    distanceCalc(currentPoint, shape.points[0]),
                    distanceCalc(currentPoint, shape.points[1]),
                    distanceCalc(currentPoint, shape.points[2]),
                    distanceCalc(currentPoint, shape.points[3]),
                  ];

                  console.log(
                    `Min point is ${distanceObj.indexOf(
                      Math.min(...distanceObj)
                    )}`
                  );
                }}
              />
            )}
          </DataMap>
        </Layer>
      </Stage>
    </Stack>
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
