import { IPoint } from './IPoint';
import { LineMarker } from './LineMarker';
import { LinearMarkerBaseState } from './LinearMarkerBaseState';

export class MeasurementMarker extends LineMarker {
  public static typeName = 'MeasurementMarker';
  public static title = 'Measurement marker';

  constructor(container: SVGGElement) {
    super(container);
  }

  protected getPath(): string {
    const tipLength = 5 + this.strokeWidth * 3;

    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    const angle = Math.atan2(dy, dx);

    const startArrowSide1: IPoint = {
      x: this.x1 + tipLength * Math.sin(angle),
      y: this.y1 - tipLength * Math.cos(angle),
    };

    const startArrowSide2: IPoint = {
      x: this.x1 - tipLength * Math.sin(angle),
      y: this.y1 + tipLength * Math.cos(angle),
    };

    const endArrowSide1: IPoint = {
      x: this.x2 + tipLength * Math.sin(angle),
      y: this.y2 - tipLength * Math.cos(angle),
    };

    const endArrowSide2: IPoint = {
      x: this.x2 - tipLength * Math.sin(angle),
      y: this.y2 + tipLength * Math.cos(angle),
    };

    // svg path for the arrow
    const result = `M ${startArrowSide1.x} ${startArrowSide1.y}
      L ${startArrowSide2.x} ${startArrowSide2.y}
      M ${this.x1} ${this.y1}
      L ${this.x2} ${this.y2}
      M ${endArrowSide1.x} ${endArrowSide1.y}
      L ${endArrowSide2.x} ${endArrowSide2.y}
      `;

    return result;
  }

  protected applyStrokeWidth() {
    super.applyStrokeWidth();
    this.adjustVisual();
  }

  /**
   * Returns marker's state.
   */
  public getState(): LinearMarkerBaseState {
    const result = super.getState();
    result.typeName = MeasurementMarker.typeName;

    return result;
  }
}
