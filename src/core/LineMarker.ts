import { LinearMarkerBase } from './LinearMarkerBase';

/**
 * Line marker represents a simple straight line.
 *
 * @summary Line marker.
 * @group Markers
 */
export class LineMarker extends LinearMarkerBase {
  public static typeName = 'LineMarker';
  public static title = 'Line marker';

  constructor(container: SVGGElement) {
    super(container);

    this.strokeColor = '#ff0000';
    this.strokeWidth = 3;

    this.createVisual = this.createVisual.bind(this);
  }

  protected getPath(): string {
    // svg path for line
    const result = `M ${this.x1} ${this.y1} L ${this.x2} ${this.y2}`;

    return result;
  }
}
