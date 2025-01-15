import { FontSize } from './FontSize';
import { RectangularBoxMarkerBaseState } from './RectangularBoxMarkerBaseState';

/**
 * Represents a state snapshot of a TextMarker.
 */
export interface TextMarkerState extends RectangularBoxMarkerBaseState {
  /**
   * Text color.
   */
  color: string;
  /**
   * Font family.
   */
  fontFamily: string;
  /**
   * Font size.
   */
  fontSize: FontSize;
  /**
   * Text content.
   */
  text: string;
}
