import { IPoint } from './IPoint';
import { LineMarker } from './LineMarker';

export type ArrowType = 'both' | 'start' | 'end' | 'none';

export class ArrowMarker extends LineMarker {
  public static typeName = 'ArrowMarker';
  public static title = 'Arrow marker';

  private arrowType: ArrowType = 'none';

  constructor(container: SVGGElement) {
    super(container);
  }

  protected getPath(): string {
    const arrowHeight = 3 * this.strokeWidth;
    const arrowWidth = 2 * this.strokeWidth;

    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    const angle = Math.atan2(dy, dx);

    // Start arrow
    const startArrowBasePoint: IPoint = {
      x: this.x1 + arrowHeight * Math.cos(angle),
      y: this.y1 + arrowHeight * Math.sin(angle),
    };

    const startArrowSide1: IPoint = {
      x: startArrowBasePoint.x + arrowWidth * Math.sin(angle),
      y: startArrowBasePoint.y - arrowWidth * Math.cos(angle),
    };

    const startArrowSide2: IPoint = {
      x: startArrowBasePoint.x - arrowWidth * Math.sin(angle),
      y: startArrowBasePoint.y + arrowWidth * Math.cos(angle),
    };

    // End arrow
    const endArrowBasePoint: IPoint = {
      x: this.x2 - arrowHeight * Math.cos(angle),
      y: this.y2 - arrowHeight * Math.sin(angle),
    };

    const endArrowSide1: IPoint = {
      x: endArrowBasePoint.x + arrowWidth * Math.sin(angle),
      y: endArrowBasePoint.y - arrowWidth * Math.cos(angle),
    };

    const endArrowSide2: IPoint = {
      x: endArrowBasePoint.x - arrowWidth * Math.sin(angle),
      y: endArrowBasePoint.y + arrowWidth * Math.cos(angle),
    };

    const startSegment =
      this.arrowType === 'start' || this.arrowType === 'both'
        ? `M ${startArrowBasePoint.x} ${startArrowBasePoint.y}
    L ${startArrowSide1.x} ${startArrowSide1.y} L ${this.x1} ${this.y1} L ${startArrowSide2.x} ${startArrowSide2.y} L ${startArrowSide1.x} ${startArrowSide1.y}
    L ${startArrowBasePoint.x} ${startArrowBasePoint.y}`
        : `M ${this.x1} ${this.y1}`;

    const endSegment =
      this.arrowType === 'end' || this.arrowType === 'both'
        ? `L ${endArrowBasePoint.x} ${endArrowBasePoint.y} M ${this.x2} ${this.y2}
    L ${endArrowSide1.x} ${endArrowSide1.y} M ${this.x2} ${this.y2} L ${endArrowSide2.x} ${endArrowSide2.y} L ${endArrowSide1.x} ${endArrowSide1.y} Z`
        : `L ${this.x2} ${this.y2}`;
    // svg path for the arrow
    const result = `${startSegment} ${endSegment}`;

    return result;
  }
}
