import { MarkerBaseState } from './MarkerBaseState';

/**
 * Represents the state of the annotation.
 *
 * The state is returned by {@link Editor!MarkerArea.getState | MarkerArea.getState()} and can be used to
 * restore the annotation in {@link Editor!MarkerArea | MarkerArea}
 * with {@link Editor!MarkerArea.restoreState | MarkerArea.restoreState()}
 * or passed to {@link Viewer!MarkerView.show | MakerView.show()}
 * or {@link Renderer!Renderer.rasterize | Renderer.rasterize()}.
 */
export interface AnnotationState {
  /**
   * Version of the annotation state format.
   *
   * Equals to 3 for the current version.
   */
  version?: number;

  /**
   * Width of the annotation.
   */
  width: number;
  /**
   * Height of the annotation.
   */
  height: number;

  /**
   * Default SVG filter to apply to markers in the annotation.
   * (e.g. "drop-shadow(2px 2px 2px black)")
   *
   * @since 3.2.0
   */
  defaultFilter?: string;

  /**
   * Array of marker states for markers in the annotation.
   */
  markers: MarkerBaseState[];
}
