import * as React from 'react';
import { Stage, Image, Layer, Rect, Group, Star, Text, Line, Circle } from 'react-konva';
import useImage from 'use-image';
import { Box, Stack, Paper, Button, Typography, Alert, Snackbar } from '@mui/material';
import { useDebounce } from '../hooks/debounce';
import { useConfiguration } from '../hooks/configuration';
import { DataLoop } from './DataLoop';
import { Conditional } from './Conditional';
import { ShapeClassifier } from './ShapeClassifier';
import { Classification } from './types/classification';
import { Shape } from './types/shape';
import { Point } from './types/point';
import { getShapeByPoint } from './helpers/get-shape-by-point';
import { createSquarePoints } from './helpers/create-square-points';
import { calculateDistanceBetweenTwoPoints } from './helpers/calculate-distance-between-two-points';
import { getShapeLines } from './helpers/get-shape-lines';
import { calculateDistanceBetweenPointAndLine } from './helpers/calculate-distance-between-point-and-line';
import { calculateSquareArea } from './helpers/calculate-square-area';

interface ImageAnnotationProps {
  imageSrc: string;
  classes: Classification[];
}

export const ImageAnnotation = (props: ImageAnnotationProps) => {
  const configuration = useConfiguration();
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
  }, configuration.debounceDuration);
  const [debounceLineMouseLogging, clearDebounceLineMouseLogging] = useDebounce((line: Point[]) => {
    if (line) {
      console.log(`Shape id - Line - ${getShapeByPoint(shapes, line[0])}`);
    }
  }, configuration.debounceDuration);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);

  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <Button onClick={() => setEnableDrawing(!enableDrawing)}>Toggle Drawing</Button>
        <Typography>{enableDrawing ? 'Drawing Enabled' : 'Drawing Disabled'}</Typography>
      </Stack>
      <Stage width={window.innerWidth} height={400}>
        <Layer
          onMouseMove={(event) => {
            if (isDrawing) {
              const currentPoint: Point = event.target.getStage().getPointerPosition();

              const currentShape: Shape = {
                id: shapes[activeShape].id,
                points: shapes[activeShape].points.map((point) => ({
                  x: point.x,
                  y: point.y,
                })),
                classification: shapes[activeShape].classification,
              };

              currentShape.points = createSquarePoints(currentShape.points[0], currentPoint);

              setShapes([...shapes.slice(0, shapes.length - 1), currentShape]);
            } else {
              const currentPoint: Point = event.target.getStage().getPointerPosition();

              // Handle point highlighting logic
              const flatPoints = shapes.flatMap((shape) => shape.points);
              const pointDistances = flatPoints.map((point) => calculateDistanceBetweenTwoPoints(currentPoint, point));

              const minPointIndex = pointDistances.indexOf(Math.min(...pointDistances));
              // let minPointShapeIndex: number;

              if (minPointIndex >= 0) {
                // minPointShapeIndex = getShapeByPoint(shapes, flatPoints[minPointIndex]);

                if (pointDistances[minPointIndex] < configuration.minimumVertexHighlightDistance) {
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

                if (lineDistances[minLineIndex] < configuration.minimumLineHighlightedDistance) {
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
              setShapes([
                ...shapes,
                {
                  id: shapes.length.toString(),
                  points: [currentPoint],
                  classification: undefined as any,
                },
              ]);
              setIsDrawing(true);
              setActiveShape(shapes.length);
            }
          }}
          onMouseUp={(event) => {
            if (isDrawing) {
              const currentPoint: Point = event.target.getStage().getPointerPosition();

              if (calculateSquareArea(shapes[activeShape].points[0], currentPoint) < configuration.minimumShapeArea) {
                setShapes(shapes.slice(0, activeShape));
                setErrorSnackbarOpen(true);
              } else {
                setShapes([
                  ...shapes.slice(0, activeShape),
                  {
                    id: activeShape.toString(),
                    points: createSquarePoints(shapes[activeShape].points[0], currentPoint, true),
                    classification: shapes[activeShape].classification,
                  },
                ]);
              }

              setIsDrawing(false);
              setActiveShape(-1);
            }
          }}
        >
          <Image image={image} />
          <DataLoop data={shapes}>{(shape, i) => <ShapeClassifier key={i} shape={shape} />}</DataLoop>
          <Conditional condition={Boolean(selectedLine)}>
            {() => (
              <React.Fragment>
                <Line
                  points={selectedLine.flatMap((point) => [point.x, point.y])}
                  stroke={configuration.highlightedLineBackgroundColor}
                  strokeWidth={configuration.highlightedLineBackgroundWidth}
                />
                <Line
                  points={selectedLine.flatMap((point) => [point.x, point.y])}
                  stroke={configuration.highlightedLineForegroundColor}
                  strokeWidth={configuration.highlightedLineForegroundWidth}
                />
                <Circle
                  x={selectedLine.map((point) => point.x).reduce((previousX, currentX) => previousX + currentX) / 2}
                  y={selectedLine.map((point) => point.y).reduce((previousY, currentY) => previousY + currentY) / 2}
                  stroke={configuration.highlightedLineInsertVertexCircleBackgroundColor}
                  strokeWidth={configuration.highlightedLineInsertVertexCircleBorderWidth}
                  fill={configuration.highlightedLineInsertVertexCircleForegroundColor}
                  radius={configuration.highlightedLineInsertVertexCircleRadius}
                />
              </React.Fragment>
            )}
          </Conditional>
          <Conditional condition={Boolean(selectedPoint)}>
            {() => (
              <React.Fragment>
                <Circle
                  x={selectedPoint.x}
                  y={selectedPoint.y}
                  stroke={configuration.highlightedPointBackgroundColor}
                  radius={configuration.highlightedPointBackgroundRadius}
                  strokeWidth={configuration.highlightedPointBackgroundWidth}
                />
                <Circle
                  x={selectedPoint.x}
                  y={selectedPoint.y}
                  fill={configuration.highlightedPointForegroundColor}
                  radius={configuration.highlightedPointForegroundRadius}
                />
              </React.Fragment>
            )}
          </Conditional>
        </Layer>
      </Stage>
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={configuration.snackbarErrorDuration}
        onClose={() => setErrorSnackbarOpen(false)}
      >
        <Alert severity="error">
          Shape must have an area of at least {configuration.minimumShapeArea} square units to be considered a valid
          polygon
        </Alert>
      </Snackbar>
    </Stack>
  );
};
