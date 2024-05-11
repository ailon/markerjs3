import { ShapeOutlineMarkerBase } from './ShapeOutlineMarkerBase';
import { ShapeOutlineMarkerBaseState } from './ShapeOutlineMarkerBaseState';

export class EllipseFrameMarker extends ShapeOutlineMarkerBase {
  /**
   * String type name of the marker type.
   */
  public static typeName = 'EllipseFrameMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
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

  public getState(): ShapeOutlineMarkerBaseState {
    const result = super.getState();
    result.typeName = EllipseFrameMarker.typeName;
    return result;
  }
}
