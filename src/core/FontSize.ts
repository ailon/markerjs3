/**
 * Font size settings.
 */
export interface FontSize {
  /**
   * Number of {@link units}.
   */
  value: number;
  /**
   * Units the {@link value} represents.
   */
  units: string;
  /**
   * Value increment/decrement step for controls cycling through the size values.
   */
  step: number;
}
