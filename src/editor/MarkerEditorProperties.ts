import { MarkerBase } from '../core';

export interface MarkerEditorProperties<TMarkerType extends MarkerBase = MarkerBase> {
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
  markerType: new (container: SVGGElement) => TMarkerType;
  /**
   * Previously created marker to edit.
   */
  marker?: TMarkerType;
}
