import { IPoint } from './IPoint';
import { MarkerBaseState } from './MarkerBaseState';

export interface PolygonMarkerState extends MarkerBaseState {
  /**
   * Polygon points.
   */
  points: Array<IPoint>,
  /**
   * Line color.
   */
  strokeColor: string,
  /**
   * Line width.
   */
  strokeWidth: number,
  /**
   * Line dash array.
   */
  strokeDasharray: string  
}
