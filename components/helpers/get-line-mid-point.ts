import { Line } from '../types/line';
import { Point } from '../types/point';

export const getLineMidPoint = (line: Line) => {
  const result: Point = {
    x: (line[0].x + line[1].x) / 2,
    y: (line[0].y + line[1].y) / 2,
  };

  return result;
};
