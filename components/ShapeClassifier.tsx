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
      onMouseDown={(event) => {}}
      onMouseEnter={() => {
        // setMouseInsideShape(true);
      }}
      onMouseLeave={() => {
        // setMouseInsideShape(false);
      }}
    />
  );
};
