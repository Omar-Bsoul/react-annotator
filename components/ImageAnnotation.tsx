import * as React from 'react';
import { Stage, Image, Layer, Rect, Group, Star, Text, Line, Circle } from 'react-konva';
import useImage from 'use-image';
import { Box, Stack, Paper, Button, Typography } from '@mui/material';

interface DataMapProps<T> {
  data: T[];
  children: (item: T, i: number) => React.ReactElement;
}

const DataMap = function <T>(props: DataMapProps<T>) {
  return <React.Fragment>{props.data.map(props.children)}</React.Fragment>;
};

interface ConditionalProps {
  condition: boolean;
  children: () => React.ReactElement;
}

const Conditional = (props: ConditionalProps) => {
  if (props.condition) {
    return props.children();
  } else {
    return <React.Fragment />;
  }
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

const calculateSquarePoints = (start: Point, end: Point, sort: boolean = false) => {
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

interface Point {
  x: number;
  y: number;
}

const calculateDistanceBetweenPoints = (start: Point, end: Point): number => {
  return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
};

const calculateDistanceBetweenPointAndLine = (point: Point, line: Point[]): number => {
  let A = point.x - line[0].x;
  let B = point.y - line[0].y;
  let C = line[1].x - line[0].x;
  let D = line[1].y - line[0].y;

  let dot = A * C + B * D;
  let len_sq = C * C + D * D;
  let param = -1;
  if (len_sq != 0)
    //in case of 0 length line
    param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = line[0].x;
    yy = line[0].y;
  } else if (param > 1) {
    xx = line[1].x;
    yy = line[1].y;
  } else {
    xx = line[0].x + param * C;
    yy = line[0].y + param * D;
  }

  let dx = point.x - xx;
  let dy = point.y - yy;
  return Math.sqrt(dx * dx + dy * dy);
};

const useDebounce = (callback: (...args: any) => void, delay: number) => {
  const [debouncing, setDebouncing] = React.useState(false);
  const [callbackArgs, setCallbackArgs] = React.useState<any>(undefined);

  React.useEffect(() => {
    if (debouncing) {
      const id = setTimeout(() => {
        setDebouncing(false);
        callback(...callbackArgs);
      }, delay);
      return () => clearTimeout(id);
    }
  }, [debouncing, callback, delay]);

  const debounce = (...args: any) => {
    setDebouncing(true);
    setCallbackArgs(args);
  };

  const clearDebounce = () => {
    setDebouncing(false);
  };

  return [debounce, clearDebounce];
};

export const ImageAnnotation = (props: Props) => {
  const [shapes, setShapes] = React.useState<Shape[]>([]);
  const [activeShape, setActiveShape] = React.useState<number>(-1);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [enableDrawing, setEnableDrawing] = React.useState(true);
  const [selectedPoint, setSelectedPoint] = React.useState<Point>(undefined);
  const [selectedLine, setSelectedLine] = React.useState<Point[]>(undefined);
  const [mouseInsideShape, setMouseInsideShape] = React.useState(false);
  const [image] = useImage(props.imageSrc);
  const [debouncePointMouseLogging, clearDebouncePointMouseLogging] = useDebounce((minIndex: number) => {
    console.log(`Shape id - ${Math.floor(minIndex / 4)}`);
  }, 500);
  const [debounceLineMouseLogging, clearDebounceLineMouseLogging] = useDebounce((x1Index: number, x2Index: number) => {
    console.log(
      `Line - ${selectedLine[0].x.toFixed(4)},${selectedLine[0].y.toFixed(4)} - ${selectedLine[1].x.toFixed(
        4,
      )},${selectedLine[1].y.toFixed(4)}`,
    );
  }, 500);

  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <Button onClick={() => setEnableDrawing(!enableDrawing)}>Toggle Drawing</Button>
        <Typography>{enableDrawing ? 'Drawing Enabled' : 'Drawing Disabled'}</Typography>
      </Stack>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer
          onMouseMove={(event) => {
            if (isDrawing) {
              const currentPoint: Point = event.target.getStage().getPointerPosition();

              const currentShape = {
                points: shapes[activeShape].points.map((point) => ({
                  x: point.x,
                  y: point.y,
                })),
              };

              currentShape.points = calculateSquarePoints(currentShape.points[0], currentPoint);

              setShapes(shapes);

              setShapes([...shapes.slice(0, shapes.length - 1), currentShape]);
            } else {
              const currentPoint: Point = event.target.getStage().getPointerPosition();

              const flatPoints = shapes.flatMap((shape) => shape.points);
              const pointDistances = flatPoints.map((point) => calculateDistanceBetweenPoints(currentPoint, point));

              const minIndex = pointDistances.indexOf(Math.min(...pointDistances));

              if (minIndex >= 0) {
                const secondMinIndex = pointDistances.indexOf(
                  Math.min(...pointDistances.filter((point, i) => i !== minIndex)),
                );

                // Handle point highlighting logic
                if (pointDistances[minIndex] < 25) {
                  setSelectedPoint(flatPoints[minIndex]);
                  debouncePointMouseLogging(minIndex);
                } else {
                  setSelectedPoint(undefined);
                  clearDebouncePointMouseLogging();
                }

                // Handle line highlighting logic
                if (secondMinIndex >= 0 && minIndex !== secondMinIndex) {
                  const line = [flatPoints[minIndex], flatPoints[secondMinIndex]];

                  if (calculateDistanceBetweenPointAndLine(currentPoint, line) < 15) {
                    setSelectedLine(line);
                    debounceLineMouseLogging(minIndex, secondMinIndex);
                  } else {
                    setSelectedLine(undefined);
                    clearDebounceLineMouseLogging();
                  }
                }
              }
            }
          }}
          onMouseDown={(event) => {
            const currentPoint: Point = event.target.getStage().getPointerPosition();

            if (enableDrawing && !mouseInsideShape) {
              setActiveShape(shapes.length);
              setIsDrawing(true);
              setShapes([...shapes, { points: [currentPoint] }]);
            } else {
              // console.log(event.target.getAncestors()[0].findAncestor());
            }
          }}
          onMouseUp={(event) => {
            if (isDrawing) {
              const currentPoint: Point = event.target.getStage().getPointerPosition();

              setActiveShape(-1);
              setIsDrawing(false);
              setShapes([
                ...shapes.slice(0, shapes.length - 1),
                {
                  points: calculateSquarePoints(shapes[shapes.length - 1].points[0], currentPoint, true),
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
                fill="#6022FF44"
                stroke="black"
                strokeWidth={2}
                closed={true}
                id={i.toString()}
                onMouseMove={(event) => {}}
                onMouseDown={(event) => {
                  const currentPoint: Point = event.target.getStage().getPointerPosition();

                  const distanceObj = [
                    calculateDistanceBetweenPoints(currentPoint, shape.points[0]),
                    calculateDistanceBetweenPoints(currentPoint, shape.points[1]),
                    calculateDistanceBetweenPoints(currentPoint, shape.points[2]),
                    calculateDistanceBetweenPoints(currentPoint, shape.points[3]),
                  ];

                  const pointNameMapping: any = {
                    0: 'Top Left',
                    1: 'Top Right',
                    2: 'Bottom Right',
                    3: 'Bottom Left',
                  };

                  const minIndex = distanceObj.indexOf(Math.min(...distanceObj));

                  if (distanceObj[minIndex] < 8) {
                    setSelectedPoint(shape.points[minIndex]);
                  }

                  console.log(`Closest point is ${minIndex} - ${pointNameMapping[minIndex]}`);
                }}
                onMouseEnter={() => {
                  setMouseInsideShape(true);
                }}
                onMouseLeave={() => {
                  setMouseInsideShape(false);
                }}
              />
            )}
          </DataMap>
          <Conditional condition={Boolean(selectedLine)}>
            {() => (
              <React.Fragment>
                <Line points={selectedLine.flatMap((point) => [point.x, point.y])} stroke="#FFFFFF77" strokeWidth={6} />
                <Line points={selectedLine.flatMap((point) => [point.x, point.y])} stroke="black" strokeWidth={2} />
                <Circle
                  x={selectedLine.map((point) => point.x).reduce((previousX, currentX) => previousX + currentX) / 2}
                  y={selectedLine.map((point) => point.y).reduce((previousY, currentY) => previousY + currentY) / 2}
                  radius={5}
                  fill="#40c220"
                  stroke="#FFFFFF"
                  strokeWidth={5}
                />
              </React.Fragment>
            )}
          </Conditional>
          <Conditional condition={Boolean(selectedPoint)}>
            {() => (
              <React.Fragment>
                <Circle x={selectedPoint.x} y={selectedPoint.y} radius={3} stroke="#FFFFFF77" strokeWidth={6} />
                <Circle x={selectedPoint.x} y={selectedPoint.y} radius={3} fill="black" />
              </React.Fragment>
            )}
          </Conditional>
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
