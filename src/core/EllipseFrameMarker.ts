import { ShapeOutlineMarkerBase } from './ShapeOutlineMarkerBase';

/**
 * Ellipse frame marker represents unfilled circle/ellipse shape.
 *
 * @summary Unfilled ellipse marker.
 * @group Markers
 */
export class EllipseFrameMarker extends ShapeOutlineMarkerBase {
  public static typeName = 'EllipseFrameMarker';
  public static title = 'Ellipse frame marker';

  constructor(container: SVGGElement) {
    super(container);

    this.strokeColor = '#ff0000';
    this.strokeWidth = 3;
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
