import { IPoint } from './IPoint';
import { TextMarkerState } from './TextMarkerState';

/**
 * Represents the state of a callout marker.
 */
export interface CalloutMarkerState extends TextMarkerState {
  /**
   * Coordinates of the position of the tip of the callout.
   */
  tipPosition: IPoint;
}
