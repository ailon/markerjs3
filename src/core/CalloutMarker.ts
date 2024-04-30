import { IPoint } from './IPoint';
import { SvgHelper } from './SvgHelper';
import { TextMarker } from './TextMarker';

export class CalloutMarker extends TextMarker {
  public static typeName = 'CalloutMarker';

  public static title = 'Callout marker';

  private tipPosition: IPoint = { x: 0, y: 0 };
  private tipBase1Position: IPoint = { x: 0, y: 0 };
  private tipBase2Position: IPoint = { x: 0, y: 0 };

  private _calloutVisual: SVGPathElement = SvgHelper.createPath('M0,0');

  constructor(container: SVGGElement) {
    super(container);

    this.color = '#ffffff';
    this.fillColor = '#ff0000';
    this.strokeColor = '#ffffff';
    this.strokeWidth = 3;
    this.padding = 20;

    this.createVisual = this.createVisual.bind(this);
    this.adjustVisual = this.adjustVisual.bind(this);
    this.getPath = this.getPath.bind(this);
    this.setTipPoints = this.setTipPoints.bind(this);
  }

  protected getPath(): string {
    const r = 5;
    this.setTipPoints();

    const result = `M ${r} 0 
      ${
        this.tipBase1Position.y === 0
          ? `H ${this.tipBase1Position.x} L ${this.tipPosition.x} ${this.tipPosition.y} L ${this.tipBase2Position.x} 0`
          : ''
      }
      H ${this.width - r} 
      A ${r} ${r} 0 0 1 ${this.width} ${r} 
      ${
        this.tipBase1Position.x === this.width
          ? `V ${this.tipBase1Position.y} L ${this.tipPosition.x} ${this.tipPosition.y} L  ${this.tipBase2Position.x} ${this.tipBase2Position.y}`
          : ''
      }
      V ${this.height - r} 
      A ${r} ${r} 0 0 1 ${this.width - r} ${this.height} 
      ${
        this.tipBase1Position.y === this.height
          ? `H ${this.tipBase2Position.x} L ${this.tipPosition.x} ${this.tipPosition.y} L ${this.tipBase1Position.x} ${this.height}`
          : ''
      }
      H ${r}
      A ${r} ${r} 0 0 1 0 ${this.height - r} 
      ${
        this.tipBase1Position.x === 0
          ? `V ${this.tipBase2Position.y} L ${this.tipPosition.x} ${this.tipPosition.y} L  ${this.tipBase1Position.x} ${this.tipBase1Position.y}`
          : ''
      }
      V ${r} 
      A ${r} ${r} 0 0 1 ${r} 0 
      Z`;

    return result;
  }

  private setTipPoints() {
    let offset = Math.min(this.height / 2, 15);
    let baseWidth = this.height / 5;

    const cornerAngle = Math.atan(this.height / 2 / (this.width / 2));
    if (
      this.tipPosition.x < this.width / 2 &&
      this.tipPosition.y < this.height / 2
    ) {
      // top left
      const tipAngle = Math.atan(
        (this.height / 2 - this.tipPosition.y) /
          (this.width / 2 - this.tipPosition.x),
      );
      if (cornerAngle < tipAngle) {
        baseWidth = this.width / 5;
        offset = Math.min(this.width / 2, 15);
        this.tipBase1Position = { x: offset, y: 0 };
        this.tipBase2Position = { x: offset + baseWidth, y: 0 };
      } else {
        this.tipBase1Position = { x: 0, y: offset };
        this.tipBase2Position = { x: 0, y: offset + baseWidth };
      }
    } else if (
      this.tipPosition.x >= this.width / 2 &&
      this.tipPosition.y < this.height / 2
    ) {
      // top right
      const tipAngle = Math.atan(
        (this.height / 2 - this.tipPosition.y) /
          (this.tipPosition.x - this.width / 2),
      );
      if (cornerAngle < tipAngle) {
        baseWidth = this.width / 5;
        offset = Math.min(this.width / 2, 15);
        this.tipBase1Position = { x: this.width - offset - baseWidth, y: 0 };
        this.tipBase2Position = { x: this.width - offset, y: 0 };
      } else {
        this.tipBase1Position = { x: this.width, y: offset };
        this.tipBase2Position = { x: this.width, y: offset + baseWidth };
      }
    } else if (
      this.tipPosition.x >= this.width / 2 &&
      this.tipPosition.y >= this.height / 2
    ) {
      // bottom right
      const tipAngle = Math.atan(
        (this.tipPosition.y - this.height / 2) /
          (this.tipPosition.x - this.width / 2),
      );
      if (cornerAngle < tipAngle) {
        baseWidth = this.width / 5;
        offset = Math.min(this.width / 2, 15);
        this.tipBase1Position = {
          x: this.width - offset - baseWidth,
          y: this.height,
        };
        this.tipBase2Position = { x: this.width - offset, y: this.height };
      } else {
        this.tipBase1Position = {
          x: this.width,
          y: this.height - offset - baseWidth,
        };
        this.tipBase2Position = { x: this.width, y: this.height - offset };
      }
    } else {
      // bottom left
      const tipAngle = Math.atan(
        (this.tipPosition.y - this.height / 2) /
          (this.width / 2 - this.tipPosition.x),
      );
      if (cornerAngle < tipAngle) {
        baseWidth = this.width / 5;
        offset = Math.min(this.width / 2, 15);
        this.tipBase1Position = { x: offset, y: this.height };
        this.tipBase2Position = { x: offset + baseWidth, y: this.height };
      } else {
        this.tipBase1Position = { x: 0, y: this.height - offset };
        this.tipBase2Position = { x: 0, y: this.height - offset - baseWidth };
      }
    }
  }

  public createVisual(): void {
    super.createVisual();

    this._calloutVisual = SvgHelper.createPath(this.getPath(), [
      ['fill', this._fillColor],
      ['stroke', this._strokeColor],
      ['stroke-width', this._strokeWidth.toString()],
      ['stroke-dasharray', this._strokeDasharray],
      ['opacity', this._opacity.toString()],
    ]);
    this.visual?.insertBefore(this._calloutVisual, this.textBlock.textElement);
  }

  public adjustVisual(): void {
    super.adjustVisual();
    this.tipPosition = {
      // x: -50,
      // x: this.width + 50,
      x: this.width / 4,
      // y: this.height / 4,
      // y: -50,
      y: this.height + 10,
    };
    if (this._calloutVisual) {
      SvgHelper.setAttributes(this._calloutVisual, [
        ['d', this.getPath()],
        ['fill', this._fillColor],
        ['stroke', this._strokeColor],
        ['stroke-width', this._strokeWidth.toString()],
        ['stroke-dasharray', this._strokeDasharray],
        ['opacity', this._opacity.toString()],
      ]);
    }
  }

  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || this._calloutVisual === el) {
      return true;
    } else {
      return false;
    }
  }
}
