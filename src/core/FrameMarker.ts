import { ShapeOutlineMarkerBase } from './ShapeOutlineMarkerBase';
import { ShapeOutlineMarkerBaseState } from './ShapeOutlineMarkerBaseState';

export class FrameMarker extends ShapeOutlineMarkerBase {
  /**
   * String type name of the marker type.
   */
  public static typeName = 'FrameMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Frame marker';

  constructor(container: SVGGElement) {
    super(container);

    this.strokeColor = '#ff0000';
    this.strokeWidth = 3;
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

  public getState(): ShapeOutlineMarkerBaseState {
    const result = super.getState();
    result.typeName = FrameMarker.typeName;
    return result;
  }
}
