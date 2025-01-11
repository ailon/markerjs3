import { ShapeMarkerBase } from './ShapeMarkerBase';

/**
 * Highlight marker is a semi-transparent rectangular marker.
 */
export class HighlightMarker extends ShapeMarkerBase {
  public static typeName = 'HighlightMarker';
  public static title = 'Highlight marker';

  constructor(container: SVGGElement) {
    super(container);

    this.fillColor = '#ffff00';
    this.opacity = 0.5;
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
