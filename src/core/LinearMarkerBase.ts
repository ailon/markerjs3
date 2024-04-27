import { LinearMarkerBaseState } from './LinearMarkerBaseState';
import { MarkerBase } from './MarkerBase';
import { MarkerBaseState } from './MarkerBaseState';
import { SvgHelper } from './SvgHelper';

export class LinearMarkerBase extends MarkerBase {
  /**
   * x coordinate of the first end-point
   */
  public x1 = 0;
  /**
   * y coordinate of the first end-point
   */
  public y1 = 0;
  /**
   * x coordinate of the second end-point
   */
  public x2 = 0;
  /**
   * y coordinate of the second end-point
   */
  public y2 = 0;

  /**
   * Marker's main visual.
   */
  protected visual: SVGGraphicsElement | undefined;

  protected selectorVisual: SVGGraphicsElement | undefined;
  protected visibleVisual: SVGGraphicsElement | undefined;

  protected applyStrokeColor() {
    if (this.visibleVisual) {
      SvgHelper.setAttributes(this.visibleVisual, [
        ['stroke', this._strokeColor],
      ]);
    }
  }

  protected applyStrokeWidth() {
    if (this.visibleVisual) {
      SvgHelper.setAttributes(this.visibleVisual, [
        ['stroke-width', this._strokeWidth.toString()],
      ]);
    }
    if (this.selectorVisual) {
      SvgHelper.setAttributes(this.selectorVisual, [
        ['stroke-width', Math.max(this._strokeWidth, 8).toString()],
      ]);
    }
  }

  protected applyStrokeDasharray() {
    if (this.visibleVisual) {
      SvgHelper.setAttributes(this.visibleVisual, [
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

    this.adjustVisual = this.adjustVisual.bind(this);
    this.getState = this.getState.bind(this);
    this.restoreState = this.restoreState.bind(this);
    this.scale = this.scale.bind(this);
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   *
   * @param el - target element.
   */
  public ownsTarget(el: EventTarget): boolean {
    if (
      super.ownsTarget(el) ||
      el === this.visual ||
      el === this.selectorVisual ||
      el === this.visibleVisual
    ) {
      return true;
    } else {
      return false;
    }
  }

  protected getPath(): string {
    return 'M0,0';
  }

  public createVisual(): void {
    this.visual = SvgHelper.createGroup();
    this.selectorVisual = SvgHelper.createPath(this.getPath(), [
      ['stroke', 'transparent'],
      ['stroke-width', Math.max(this.strokeWidth, 8).toString()],
    ]);
    this.visibleVisual = SvgHelper.createPath(this.getPath(), [
      ['stroke', this.strokeColor],
      ['fill', this.strokeColor],
      ['stroke-width', this.strokeWidth.toString()],
      ['stroke-linejoin', 'round'],
    ]);
    this.visual.appendChild(this.selectorVisual);
    this.visual.appendChild(this.visibleVisual);

    this.addMarkerVisualToContainer(this.visual);
  }

  /**
   * When implemented adjusts marker visual after manipulation when needed.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public adjustVisual(): void {
    if (this.selectorVisual && this.visibleVisual) {
      SvgHelper.setAttributes(this.selectorVisual, [['d', this.getPath()]]);
      SvgHelper.setAttributes(this.visibleVisual, [['d', this.getPath()]]);

      SvgHelper.setAttributes(this.visibleVisual, [
        ['stroke', this.strokeColor],
      ]);
      SvgHelper.setAttributes(this.visibleVisual, [['fill', this.strokeColor]]);
      SvgHelper.setAttributes(this.visibleVisual, [
        ['stroke-width', this.strokeWidth.toString()],
      ]);
      SvgHelper.setAttributes(this.visibleVisual, [
        ['stroke-dasharray', this.strokeDasharray.toString()],
      ]);
    }
  }

  /**
   * Returns marker's state.
   */
  public getState(): LinearMarkerBaseState {
    const result: LinearMarkerBaseState = Object.assign(
      {
        x1: this.x1,
        y1: this.y1,
        x2: this.x2,
        y2: this.y2,
      },
      super.getState(),
    );

    return result;
  }

  /**
   * Restores marker's state to the previously saved one.
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    super.restoreState(state);

    const lmbState = state as LinearMarkerBaseState;
    this.x1 = lmbState.x1;
    this.y1 = lmbState.y1;
    this.x2 = lmbState.x2;
    this.y2 = lmbState.y2;

    this.createVisual();
    this.adjustVisual();
  }

  /**
   * Scales marker. Used after the image resize.
   *
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    this.x1 = this.x1 * scaleX;
    this.y1 = this.y1 * scaleY;
    this.x2 = this.x2 * scaleX;
    this.y2 = this.y2 * scaleY;

    this.adjustVisual();
  }
}
