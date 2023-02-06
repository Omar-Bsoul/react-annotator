import * as React from 'react';
import { Stage, Image, Layer, Rect, Group, Star, Text, Line, Circle } from 'react-konva';
import { Shape } from './types/Shape';

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
        // const currentPoint: Point = event.target.getStage().getPointerPosition();
        // const distanceObj = [
        //   calculateDistanceBetweenPoints(currentPoint, shape.points[0]),
        //   calculateDistanceBetweenPoints(currentPoint, shape.points[1]),
        //   calculateDistanceBetweenPoints(currentPoint, shape.points[2]),
        //   calculateDistanceBetweenPoints(currentPoint, shape.points[3]),
        // ];
        // const pointNameMapping: any = {
        //   0: 'Top Left',
        //   1: 'Top Right',
        //   2: 'Bottom Right',
        //   3: 'Bottom Left',
        // };
        // const minIndex = distanceObj.indexOf(Math.min(...distanceObj));
        // if (distanceObj[minIndex] < 8) {
        //   setSelectedPoint(shape.points[minIndex]);
        // }
        // console.log(`Closest point is ${minIndex} - ${pointNameMapping[minIndex]}`);
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
