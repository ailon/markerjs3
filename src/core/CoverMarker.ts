import { ShapeMarkerBase } from './ShapeMarkerBase';
import { ShapeMarkerBaseState } from './ShapeMarkerBaseState';

export class CoverMarker extends ShapeMarkerBase {
  /**
   * String type name of the marker type.
   */
  public static typeName = 'CoverMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Cover marker';

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

  public getState(): ShapeMarkerBaseState {
    const result = super.getState();
    result.typeName = CoverMarker.typeName;
    return result;
  }
}
