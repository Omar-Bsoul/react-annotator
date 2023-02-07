import { Point } from '../types/point';

export const calculateDistanceBetweenTwoPoints = (start: Point, end: Point) => {
  return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
};
