import { IPoint } from './IPoint';
import { MarkerBaseState } from './MarkerBaseState';

export interface PolygonMarkerState extends MarkerBaseState {
  /**
   * Polygon points.
   */
  points: Array<IPoint>,
}
