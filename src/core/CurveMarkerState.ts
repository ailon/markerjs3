import { LinearMarkerBaseState } from './LinearMarkerBaseState';

export interface CurveMarkerState extends LinearMarkerBaseState {
  /**
   * x coordinate for the curve control point.
   */
  curveX: number;
  /**
   * y coordinate for the curve control point.
   */
  curveY: number;
}
