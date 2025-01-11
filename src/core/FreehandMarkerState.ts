import { IPoint } from './IPoint';
import { MarkerBaseState } from './MarkerBaseState';

/**
 * Represents the state of a freehand marker.
 */
export interface FreehandMarkerState extends MarkerBaseState {
  /**
   * Points of the freehand line.
   */
  points: Array<IPoint>;
}
