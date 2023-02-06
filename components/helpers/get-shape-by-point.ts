import { Shape } from '../types/shape';
import { Point } from '../types/point';

export const getShapeByPoint = (shapes: Shape[], point: Point) => {
  for (let i = 0; i < shapes.length; i++) {
    for (let j = 0; j < shapes[i].points.length; j++) {
      if (shapes[i].points[j].x === point.x && shapes[i].points[j].y === point.y) {
        return i;
      }
    }
  }
};
