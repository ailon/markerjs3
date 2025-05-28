import { IPoint } from './IPoint';
import { MarkerBaseState } from './MarkerBaseState';

/**
 * Represents polygon marker's state used to save and restore state.
 */
export interface PolygonMarkerState extends MarkerBaseState {
  /**
   * Polygon points.
   */
  points: Array<IPoint>;
  /**
   * Marker's fill color.
   *
   * @since 3.6.2
   */
  fillColor?: string;
}
