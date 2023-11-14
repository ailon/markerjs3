import { RectangularBoxMarkerBaseState } from './RectangularBoxMarkerBaseState';

/**
 * Represents outle shape's state.
 */
export interface ShapeOutlineMarkerBaseState extends RectangularBoxMarkerBaseState {
  strokeColor: string;
  strokeWidth: number;
  strokeDasharray: string;
  opacity: number;
}
