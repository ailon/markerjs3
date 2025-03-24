import { FreehandMarker } from './FreehandMarker';

/**
 * Highlighter marker imitates a freeform highlighter pen.
 *
 * @summary Semi-transparent freeform marker.
 * @group Markers
 * @since 3.2.0
 */
export class HighlighterMarker extends FreehandMarker {
  public static typeName = 'HighlighterMarker';
  public static title = 'Highlighter marker';
  public static applyDefaultFilter = false;

  constructor(container: SVGGElement) {
    super(container);

    this.opacity = 0.5;
    this.strokeColor = '#ffff00';
    this.strokeWidth = 20;
  }
}
