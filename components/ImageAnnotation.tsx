import * as React from 'react';
import { Stage, Image, Layer, Rect, Group, Star, Text, Line, Circle } from 'react-konva';
import useImage from 'use-image';
import { Box, Stack, Paper, Button, Typography } from '@mui/material';
import { useDebounce } from '../hooks/debounce';
import { DataLoop } from './DataLoop';
import { Conditional } from './Conditional';
import { ShapeClassifier } from './ShapeClassifier';

interface ImageAnnotationProps {
  imageSrc: string;
  classes: Classification[];
}

export const ImageAnnotation = (props: ImageAnnotationProps) => {
  const [shapes, setShapes] = React.useState<Shape[]>([]);
  const [activeShape, setActiveShape] = React.useState<number>(-1);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [enableDrawing, setEnableDrawing] = React.useState(true);
  const [selectedPoint, setSelectedPoint] = React.useState<Point>(undefined);
  const [selectedLine, setSelectedLine] = React.useState<Point[]>(undefined);
  const [mouseInsideShape, setMouseInsideShape] = React.useState(false);
  const [image] = useImage(props.imageSrc);
  const [debouncePointMouseLogging, clearDebouncePointMouseLogging] = useDebounce((point: Point) => {
    if (point) {
      console.log(`Shape id - Point - ${getShapeByPoint(shapes, point)}`);
    }
  }, 500);
  const [debounceLineMouseLogging, clearDebounceLineMouseLogging] = useDebounce((line: Point[]) => {
    if (line) {
      console.log(`Shape id - Line - ${getShapeByPoint(shapes, line[0])}`);
    }
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

              setShapes([...shapes.slice(0, shapes.length - 1), currentShape]);
            } else {
              const currentPoint: Point = event.target.getStage().getPointerPosition();

              // Handle point highlighting logic
              const flatPoints = shapes.flatMap((shape) => shape.points);
              const pointDistances = flatPoints.map((point) => calculateDistanceBetweenPoints(currentPoint, point));

              const minPointIndex = pointDistances.indexOf(Math.min(...pointDistances));
              // let minPointShapeIndex: number;

              if (minPointIndex >= 0) {
                // minPointShapeIndex = getShapeByPoint(shapes, flatPoints[minPointIndex]);

                if (pointDistances[minPointIndex] < 25) {
                  setSelectedPoint(flatPoints[minPointIndex]);
                  debouncePointMouseLogging(flatPoints[minPointIndex]);
                } else {
                  setSelectedPoint(undefined);
                  clearDebouncePointMouseLogging();
                }
              }

              // Handle line highlighting logic
              const flatLines = shapes.flatMap((shape) => getShapeLines(shape));
              const lineDistances = flatLines.map((line) => calculateDistanceBetweenPointAndLine(currentPoint, line));

              const minLineIndex = lineDistances.indexOf(Math.min(...lineDistances));

              if (minLineIndex >= 0) {
                // const minLineShapeIndex = getShapeByPoint(shapes, flatLines[minLineIndex][0]);

                if (lineDistances[minLineIndex] < 15) {
                  setSelectedLine(flatLines[minLineIndex]);
                  debounceLineMouseLogging(flatLines[minLineIndex]);
                } else {
                  setSelectedLine(undefined);
                  clearDebounceLineMouseLogging();
                }
              }
            }
          }}
          onMouseDown={(event) => {
            const currentPoint: Point = event.target.getStage().getPointerPosition();

            if (enableDrawing && !isDrawing && !mouseInsideShape) {
              setActiveShape(shapes.length);
              setIsDrawing(true);
              setShapes([...shapes, { points: [currentPoint] }]);
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
          <DataLoop data={shapes}>{(shape, i) => <ShapeClassifier key={i} shape={shape} />}</DataLoop>
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
