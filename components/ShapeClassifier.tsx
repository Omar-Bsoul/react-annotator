import * as React from 'react';
import { Stage, Image, Layer, Rect, Group, Star, Text, Line, Circle } from 'react-konva';
import { Shape } from './types/Shape';
import { Point } from './types/Point';
import { calculateDistanceBetweenTwoPoints } from './helpers/calculate-distance-between-two-points';
import { calculateDistanceBetweenPointAndLine } from './helpers/calculate-distance-between-point-and-line';
import { getShapeLines } from './helpers/get-shape-lines';

export interface ShapeClassifierProps {
  shape: Shape;
}

export const ShapeClassifier = (props: ShapeClassifierProps) => {
  return (
    <Line
      points={props.shape.points.flatMap((point) => [point.x, point.y])}
      fill="#6022FF44"
      stroke="black"
      strokeWidth={2}
      closed={true}
      onMouseMove={(event) => {}}
      onMouseDown={(event) => {
        const currentPoint: Point = event.target.getStage().getPointerPosition();

        const lines = getShapeLines(props.shape);

        const verteicesDistances = props.shape.points.map((vertex) => ({
          distance: calculateDistanceBetweenTwoPoints(currentPoint, vertex),
          kind: 'Vertex',
        }));

        const edgesDistances = lines
          .map((line) => ({
            x: (line[0].x + line[1].x) / 2,
            y: (line[0].y + line[1].y) / 2,
          }))
          .map((lineAddVertex) => ({
            distance: calculateDistanceBetweenTwoPoints(currentPoint, lineAddVertex),
            kind: 'LineAddVertex',
          }));

        [...verteicesDistances, ...edgesDistances].sort((a, b) => a.distance - b.distance);
      }}
      onMouseEnter={() => {
        // setMouseInsideShape(true);
      }}
      onMouseLeave={() => {
        // setMouseInsideShape(false);
      }}
    />
  );
};
