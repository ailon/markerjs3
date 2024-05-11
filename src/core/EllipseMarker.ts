import { ShapeMarkerBase } from './ShapeMarkerBase';
import { ShapeMarkerBaseState } from './ShapeMarkerBaseState';

export class EllipseMarker extends ShapeMarkerBase {
  /**
   * String type name of the marker type.
   */
  public static typeName = 'EllipseMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
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

  public getState(): ShapeMarkerBaseState {
    const result = super.getState();
    result.typeName = EllipseMarker.typeName;
    return result;
  }
}
