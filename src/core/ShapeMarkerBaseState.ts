import { ShapeOutlineMarkerBaseState } from './ShapeOutlineMarkerBaseState';

/**
 * Represents filled shape's state.
 */
export interface ShapeMarkerBaseState extends ShapeOutlineMarkerBaseState {
  /**
   * Marker's fill color.
   */
  fillColor: string;
}
