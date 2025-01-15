import { MarkerBaseState } from './MarkerBaseState';
import { RectangularBoxMarkerBase } from './RectangularBoxMarkerBase';
import { SvgHelper } from './SvgHelper';

/**
 * Shape outline marker is a base class for all markers that represent a shape outline.
 */
export class ShapeOutlineMarkerBase extends RectangularBoxMarkerBase {
  public static title = 'Shape outline marker';

  protected applyStrokeColor() {
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke', this._strokeColor]]);
    }
  }

  protected applyStrokeWidth() {
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [
        ['stroke-width', this._strokeWidth.toString()],
      ]);
    }
  }

  protected applyStrokeDasharray() {
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [
        ['stroke-dasharray', this._strokeDasharray],
      ]);
    }
  }

  protected applyOpacity() {
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [
        ['opacity', this._opacity.toString()],
      ]);
    }
  }

  constructor(container: SVGGElement) {
    super(container);

    this.createVisual = this.createVisual.bind(this);
  }

  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || el === this.visual) {
      return true;
    } else {
      return false;
    }
  }

  protected getPath(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    width: number = this.width,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    height: number = this.height,
  ): string {
    return 'M0,0';
  }

  public getOutline(): string {
    return this.getPath(this.defaultSize.width, this.defaultSize.height);
  }

  /**
   * Creates marker's visual.
   */
  public createVisual(): void {
    this.visual = SvgHelper.createPath(this.getPath(), [
      ['fill', 'transparent'],
      ['stroke', this._strokeColor],
      ['stroke-width', this._strokeWidth.toString()],
      ['stroke-dasharray', this._strokeDasharray],
      ['opacity', this._opacity.toString()],
    ]);
    this.addMarkerVisualToContainer(this.visual);
  }

  /**
   * Adjusts marker's visual according to the current state
   * (color, width, etc.).
   */
  public adjustVisual(): void {
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [
        ['d', this.getPath()],
        ['fill', 'transparent'],
        ['stroke', this._strokeColor],
        ['stroke-width', this._strokeWidth.toString()],
        ['stroke-dasharray', this._strokeDasharray],
        ['opacity', this._opacity.toString()],
      ]);
    }
  }

  public setSize(): void {
    super.setSize();
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['d', this.getPath()]]);
    }
  }

  public restoreState(state: MarkerBaseState): void {
    this.createVisual();
    super.restoreState(state);
    this.adjustVisual();
  }

  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    this.strokeWidth *= (scaleX + scaleY) / 2;

    this.setSize();
  }
}
