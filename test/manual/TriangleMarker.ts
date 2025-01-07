import { ShapeOutlineMarkerBase } from '../../src/core';

export class TriangleMarker extends ShapeOutlineMarkerBase {
  public static typeName = 'TriangleMarker';
  public static title = 'Triangle marker';

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
      L ${width} ${height} 
      L 0 ${height} Z`;

    return result;
  }
}
