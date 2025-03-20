import { CurveMarkerState } from './CurveMarkerState';
import { LineMarker } from './LineMarker';

/**
 * Curve marker represents a curved line.
 *
 * @summary Curve marker.
 * @group Markers
 */
export class CurveMarker extends LineMarker {
  public static typeName = 'CurveMarker';
  public static title = 'Curve marker';

  /**
   * x coordinate for the curve control point.
   */
  public curveX = 0;
  /**
   * y coordinate for the curve control point.
   */
  public curveY = 0;

  constructor(container: SVGGElement) {
    super(container);

    this.fillColor = 'transparent';
  }

  protected getPath(): string {
    const result = `M ${this.x1} ${this.y1} Q ${this.curveX} ${this.curveY}, ${this.x2} ${this.y2}`;
    return result;
  }

  public getState(): CurveMarkerState {
    const result: CurveMarkerState = Object.assign(
      {
        curveX: this.curveX,
        curveY: this.curveY,
      },
      super.getState(),
    );

    return result;
  }

  public restoreState(state: CurveMarkerState): void {
    this.curveX = state.curveX;
    this.curveY = state.curveY;

    super.restoreState(state);
  }
}
