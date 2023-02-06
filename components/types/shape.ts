import { Point } from './point';
import { Classification } from './classification';

export interface Shape {
  id: string;
  points: Point[];
  classification: Classification;
}
