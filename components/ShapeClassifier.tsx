import * as React from 'react';
import { Stage, Image, Layer, Rect, Group, Star, Text, Line, Circle } from 'react-konva';
import { Shape } from './types/Shape';
import { Point } from './types/Point';
import { calculateDistanceBetweenTwoPoints } from './helpers/calculate-distance-between-two-points';
import { calculateDistanceBetweenPointAndLine } from './helpers/calculate-distance-between-point-and-line';
import { getShapeLines } from './helpers/get-shape-lines';
import { useConfiguration } from '../hooks/configuration';

export interface ShapeClassifierProps {
  shape: Shape;
}

export const ShapeClassifier = (props: ShapeClassifierProps) => {
  const configuration = useConfiguration();

  return (
    <Line
      points={props.shape.points.flatMap((point) => [point.x, point.y])}
      fill={configuration.classifierColor}
      stroke={configuration.classifierBorderColor}
      strokeWidth={configuration.classifierBorderWidth}
      closed={true}
      // onMouseMove={(event) => {}}
      // onMouseDown={(event) => {}}
      // onMouseEnter={() => {}}
      // onMouseLeave={() => {}}
    />
  );
};
