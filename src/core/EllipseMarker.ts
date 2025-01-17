import { ShapeMarkerBase } from './ShapeMarkerBase';

/**
 * Ellipse marker is a filled ellipse marker.
 *
 * @summary Filled ellipse marker.
 * @group Markers
 */
export class EllipseMarker extends ShapeMarkerBase {
  public static typeName = 'EllipseMarker';
  public static title = 'Ellipse marker';

  constructor(container: SVGGElement) {
    super(container);

    this.fillColor = '#ff0000';
    this.strokeColor = '#ff0000';
  }

  protected getPath(
    width: number = this.width,
    height: number = this.height,
  ): string {
    const result = `M ${width / 2} 0 
    a ${width / 2} ${height / 2} 0 1 0 0 ${height} 
    a ${width / 2} ${height / 2} 0 1 0 0 -${height} z`;

    return result;
  }
}
