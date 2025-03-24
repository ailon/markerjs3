import { FreehandMarker } from './FreehandMarker';

/**
 * Highlighter marker imitates a freeform highlighter pen.
 *
 * @summary Semi-transparent freeform marker.
 * @group Markers
 */
export class HighlighterMarker extends FreehandMarker {
  public static typeName = 'HighlighterMarker';
  public static title = 'Highlighter marker';

  constructor(container: SVGGElement) {
    super(container);

    this.opacity = 0.5;
    this.strokeColor = '#ffff00';
    this.strokeWidth = 20;
  }
}
