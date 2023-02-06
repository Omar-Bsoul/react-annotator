import { Point } from '../types/point';

export const calculateSquareArea = (start: Point, end: Point) => {
  return Math.abs(start.x - end.x) * Math.abs(start.y - end.y);
};
