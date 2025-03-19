import { IPoint } from './IPoint';
import { LineMarker } from './LineMarker';

/**
 * Represents a measurement marker.
 *
 * Measurement marker is a line with two vertical bars at the ends.
 *
 * @summary A line with two vertical bars at the ends.
 * @group Markers
 */
export class MeasurementMarker extends LineMarker {
  public static typeName = 'MeasurementMarker';
  public static title = 'Measurement marker';

  constructor(container: SVGGElement) {
    super(container);
  }

  protected getStartTerminatorPath(): string {
    const { tipLength, angle } = this.getTerminatorProperties();

    const startArrowSide1: IPoint = {
      x: this.x1 + tipLength * Math.sin(angle),
      y: this.y1 - tipLength * Math.cos(angle),
    };

    const startArrowSide2: IPoint = {
      x: this.x1 - tipLength * Math.sin(angle),
      y: this.y1 + tipLength * Math.cos(angle),
    };

    const result = `M ${startArrowSide1.x} ${startArrowSide1.y}
      L ${startArrowSide2.x} ${startArrowSide2.y}`;

    return result;
  }

  protected getEndTerminatorPath(): string {
    const { tipLength, angle } = this.getTerminatorProperties();

    const endArrowSide1: IPoint = {
      x: this.x2 + tipLength * Math.sin(angle),
      y: this.y2 - tipLength * Math.cos(angle),
    };

    const endArrowSide2: IPoint = {
      x: this.x2 - tipLength * Math.sin(angle),
      y: this.y2 + tipLength * Math.cos(angle),
    };

    // svg path for the arrow
    const result = `M ${endArrowSide1.x} ${endArrowSide1.y} L ${endArrowSide2.x} ${endArrowSide2.y}`;

    return result;
  }

  private getTerminatorProperties() {
    const tipLength = 5 + this.strokeWidth * 3;

    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    const angle = Math.atan2(dy, dx);
    return { tipLength, angle };
  }

  protected applyStrokeWidth() {
    super.applyStrokeWidth();
    this.adjustVisual();
  }
}
