export const createSquarePoints = (start: Point, end: Point, sort: boolean = false) => {
  const x1 = sort ? Math.min(start.x, end.x) : start.x;
  const y1 = sort ? Math.min(start.y, end.y) : start.y;
  const x2 = sort ? Math.max(start.x, end.x) : end.x;
  const y2 = sort ? Math.max(start.y, end.y) : end.y;

  const result = [
    { x: x1, y: y1 },
    { x: x2, y: y1 },
    { x: x2, y: y2 },
    { x: x1, y: y2 },
  ];

  return result;
};
