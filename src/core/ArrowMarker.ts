import { ArrowMarkerState, ArrowType } from './ArrowMarkerState';
import { IPoint } from './IPoint';
import { LineMarker } from './LineMarker';
import { MarkerBaseState } from './MarkerBaseState';

/**
 * Arrow marker represents a line with arrow heads at the ends.
 *
 * @summary A line with arrow heads at the ends.
 *
 * @group Markers
 */
export class ArrowMarker extends LineMarker {
  public static typeName = 'ArrowMarker';
  public static title = 'Arrow marker';

  private _arrowType: ArrowType = 'end';
  /**
   * Type of the arrow.
   *
   * Specify whether the arrow should be drawn at the start, end, both ends or none.
   */
  public get arrowType(): ArrowType {
    return this._arrowType;
  }
  public set arrowType(value: ArrowType) {
    this._arrowType = value;
    this.adjustVisual();
  }

  constructor(container: SVGGElement) {
    super(container);

    this.getArrowProperties = this.getArrowProperties.bind(this);
    this.getStartTerminatorPath = this.getStartTerminatorPath.bind(this);
    this.getEndTerminatorPath = this.getEndTerminatorPath.bind(this);
  }

  private getArrowProperties() {
    const arrowHeight = 10 + this.strokeWidth * 2;
    const arrowWidth = Math.min(
      Math.max(5, this.strokeWidth * 2),
      this.strokeWidth + 5,
    );
    const arrowDipFactor = 0.7; // arrow base "bend factor"

    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    const angle = Math.atan2(dy, dx);
    return { arrowHeight, arrowDipFactor, angle, arrowWidth };
  }

  protected getStartTerminatorPath(): string {
    const { arrowHeight, arrowDipFactor, angle, arrowWidth } =
      this.getArrowProperties();

    // Start arrow
    const startArrowBasePoint: IPoint = {
      x: this.x1 + arrowHeight * arrowDipFactor * Math.cos(angle),
      y: this.y1 + arrowHeight * arrowDipFactor * Math.sin(angle),
    };

    const startArrowTipBasePoint: IPoint = {
      x: this.x1 + arrowHeight * Math.cos(angle),
      y: this.y1 + arrowHeight * Math.sin(angle),
    };

    const startArrowSide1: IPoint = {
      x: startArrowTipBasePoint.x + arrowWidth * Math.sin(angle),
      y: startArrowTipBasePoint.y - arrowWidth * Math.cos(angle),
    };

    const startArrowSide2: IPoint = {
      x: startArrowTipBasePoint.x - arrowWidth * Math.sin(angle),
      y: startArrowTipBasePoint.y + arrowWidth * Math.cos(angle),
    };

    const startSegment =
      this.arrowType === 'start' || this.arrowType === 'both'
        ? `M ${startArrowBasePoint.x} ${startArrowBasePoint.y}
    L ${startArrowSide1.x} ${startArrowSide1.y} L ${this.x1} ${this.y1} L ${startArrowSide2.x} ${startArrowSide2.y} L ${startArrowBasePoint.x} ${startArrowBasePoint.y}
    L ${startArrowBasePoint.x} ${startArrowBasePoint.y}`
        : ``;

    return startSegment;
  }

  protected getEndTerminatorPath(): string {
    const { arrowHeight, arrowDipFactor, angle, arrowWidth } =
      this.getArrowProperties();

    // End arrow
    const endArrowBasePoint: IPoint = {
      x: this.x2 - arrowHeight * arrowDipFactor * Math.cos(angle),
      y: this.y2 - arrowHeight * arrowDipFactor * Math.sin(angle),
    };

    const endArrowTipBasePoint: IPoint = {
      x: this.x2 - arrowHeight * Math.cos(angle),
      y: this.y2 - arrowHeight * Math.sin(angle),
    };

    const endArrowSide1: IPoint = {
      x: endArrowTipBasePoint.x + arrowWidth * Math.sin(angle),
      y: endArrowTipBasePoint.y - arrowWidth * Math.cos(angle),
    };

    const endArrowSide2: IPoint = {
      x: endArrowTipBasePoint.x - arrowWidth * Math.sin(angle),
      y: endArrowTipBasePoint.y + arrowWidth * Math.cos(angle),
    };

    const endSegment =
      this.arrowType === 'end' || this.arrowType === 'both'
        ? `M ${endArrowBasePoint.x} ${endArrowBasePoint.y} 
    L ${endArrowSide1.x} ${endArrowSide1.y} L ${this.x2} ${this.y2} L ${endArrowSide2.x} ${endArrowSide2.y} L ${endArrowBasePoint.x} ${endArrowBasePoint.y} Z`
        : ``;

    return endSegment;
  }

  protected applyStrokeWidth() {
    super.applyStrokeWidth();
    this.adjustVisual();
  }

  public getState(): ArrowMarkerState {
    const result: ArrowMarkerState = Object.assign(
      {
        arrowType: this.arrowType,
      },
      super.getState(),
    );
    result.typeName = ArrowMarker.typeName;

    return result;
  }

  public restoreState(state: MarkerBaseState): void {
    const arrowState = state as ArrowMarkerState;
    this.arrowType = arrowState.arrowType;

    super.restoreState(state);
  }
}
