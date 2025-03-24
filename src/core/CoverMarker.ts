import { ShapeMarkerBase } from './ShapeMarkerBase';

/**
 * Cover marker is a filled rectangle marker.
 *
 * A typical use case is to cover some area of the image with a colored rectangle as a "redaction".
 *
 * @summary Filled rectangle marker.
 * @group Markers
 */
export class CoverMarker extends ShapeMarkerBase {
  public static typeName = 'CoverMarker';
  public static title = 'Cover marker';
  public static applyDefaultFilter = false;

  constructor(container: SVGGElement) {
    super(container);

    this.fillColor = '#000000';
    this.strokeColor = 'transparent';
    this.strokeWidth = 0;
  }

  protected getPath(
    width: number = this.width,
    height: number = this.height,
  ): string {
    const result = `M 0 0 
      H ${width} 
      V ${height} 
      H 0 
      V 0 Z`;

    return result;
  }
}
