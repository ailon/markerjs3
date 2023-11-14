import { RectangularBoxMarkerBaseState } from './RectangularBoxMarkerBaseState';

/**
 * Represents outle shape's state.
 */
export interface ShapeOutlineMarkerBaseState extends RectangularBoxMarkerBaseState {
  /**
   * Rectangle border stroke (line) color.
   */
  strokeColor: string;
  /**
   * Rectange border width.
   */
  strokeWidth: number;
  /**
   * Rectange border dash array.
   */
  strokeDasharray: string;
  /**
   * Rectangle opacity (alpha). 0 to 1.
   */
  opacity: number;
}
