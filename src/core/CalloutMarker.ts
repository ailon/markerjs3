import { IPoint } from './IPoint';
import { SvgHelper } from './SvgHelper';
import { TextMarker } from './TextMarker';

export class CalloutMarker extends TextMarker {
  public static typeName = 'CalloutMarker';

  public static title = 'Callout marker';

  private _tipPoint: IPoint = { x: 0, y: 0 };

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
  }

  protected getPath(): string {
    const result = `M 0 0 
    H ${this.width} 
    V ${this.height} 
    H ${this._tipPoint.x + 20}
    L ${this._tipPoint.x} ${this._tipPoint.y}
    L 0 ${this.height}
    V 0 Z`;

    return result;
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
    this._tipPoint = {
      x: this.width / 4,
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
