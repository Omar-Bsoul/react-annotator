import { Shape } from '../types/shape';
import { Line } from '../types/line';

export const getShapeLines = (shape: Shape) => {
  const lines: Line[] = [];

  for (let i = 0; i < shape.points.length - 1; i++) {
    lines.push([shape.points[i], shape.points[i + 1]]);
  }
  lines.push([shape.points[shape.points.length - 1], shape.points[0]]);

  return lines;
};
