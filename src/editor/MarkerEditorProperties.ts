import { MarkerBase } from '../core';

export interface MarkerEditorProperties {
  /**
   * SVG container for the marker and editor elements.
   */
  container: SVGGElement;
  /**
   * HTML overlay container for editor's HTML elements (such as label text editor).
   */
  overlayContainer: HTMLDivElement;
  /**
   * Type of marker to create.
   */
  markerType: typeof MarkerBase;
  /**
   * Previously created marker to edit.
   */
  marker?: MarkerBase;
}
