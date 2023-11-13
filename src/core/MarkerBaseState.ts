/**
 * Represents marker's state used to save and restore state continue annotation in the future.
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
}
