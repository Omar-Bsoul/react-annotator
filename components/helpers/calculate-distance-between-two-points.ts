export const calculateDistanceBetweenTwoPoints = (start: Point, end: Point): number => {
  return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
};
