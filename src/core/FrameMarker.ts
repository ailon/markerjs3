import { ShapeOutlineMarkerBase } from './ShapeOutlineMarkerBase';

/**
 * Frame marker represents unfilled rectangle shape.
 */
export class FrameMarker extends ShapeOutlineMarkerBase {
  public static typeName = 'FrameMarker';
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
}
