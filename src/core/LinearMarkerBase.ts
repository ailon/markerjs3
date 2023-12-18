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

  protected _strokeColor = 'transparent';
  public get strokeColor() {
    return this._strokeColor;
  }
  public set strokeColor(color: string) {
    this._strokeColor = color;
    if (this.visibleVisual) {
      SvgHelper.setAttributes(this.visibleVisual, [
        ['stroke', this._strokeColor],
      ]);
    }
  }

  protected _strokeWidth = 0;
  public get strokeWidth() {
    return this._strokeWidth;
  }
  public set strokeWidth(value) {
    this._strokeWidth = value;
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

  protected _strokeDasharray = '';
  public get strokeDasharray() {
    return this._strokeDasharray;
  }
  public set strokeDasharray(value) {
    this._strokeDasharray = value;
    if (this.visibleVisual) {
      SvgHelper.setAttributes(this.visibleVisual, [
        ['stroke-dasharray', this._strokeDasharray],
      ]);
    }
  }

  protected _opacity = 1;
  public get opacity() {
    return this._opacity;
  }
  public set opacity(value) {
    this._opacity = value;
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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public createVisual(): void {}

  /**
   * When implemented adjusts marker visual after manipulation when needed.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public adjustVisual(): void {}

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
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
        strokeDasharray: this.strokeDasharray,
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
    this.strokeColor = lmbState.strokeColor;
    this.strokeWidth = lmbState.strokeWidth;
    this.strokeDasharray = lmbState.strokeDasharray;

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