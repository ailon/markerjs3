import { IPoint } from './IPoint';
import { ShapeMarkerBaseState } from './ShapeMarkerBaseState';
import { TextMarkerState } from './TextMarkerState';

/**
 * Represents the state of a callout marker.
 */
export interface CalloutMarkerState
  extends TextMarkerState,
    ShapeMarkerBaseState {
  /**
   * Coordinates of the position of the tip of the callout.
   */
  tipPosition: IPoint;
}
