/**
 * Represents marker's state used to save and restore state.
 *
 * The state can then be serialized and stored for future use like to continue
 * annotation in the future, display it in a viewer or render as a static image.
 */
export interface MarkerBaseState {
  /**
   * Marker's type name.
   */
  typeName: string;
  /**
   * Additional information about the marker.
   */
  notes?: string;

  /**
   * Marker's stroke (outline) color.
   */
  strokeColor?: string;
  /**
   * Marker's stroke (outline) width.
   */
  strokeWidth?: number;
  /**
   * Marker's stroke (outline) dash array.
   */
  strokeDasharray?: string;
  /**
   * Marker's opacity.
   */
  opacity?: number;
}
