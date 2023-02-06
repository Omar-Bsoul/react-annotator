import { Line } from '../types/line';

export const calculateDistanceBetweenPointAndLine = (point: Point, line: Line): number => {
  let A = point.x - line[0].x;
  let B = point.y - line[0].y;
  let C = line[1].x - line[0].x;
  let D = line[1].y - line[0].y;

  let dot = A * C + B * D;
  let len_sq = C * C + D * D;
  let param = -1;
  if (len_sq != 0)
    //in case of 0 length line
    param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = line[0].x;
    yy = line[0].y;
  } else if (param > 1) {
    xx = line[1].x;
    yy = line[1].y;
  } else {
    xx = line[0].x + param * C;
    yy = line[0].y + param * D;
  }

  let dx = point.x - xx;
  let dy = point.y - yy;
  return Math.sqrt(dx * dx + dy * dy);
};
