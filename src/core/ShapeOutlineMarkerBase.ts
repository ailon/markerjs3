import { MarkerBaseState } from './MarkerBaseState';
import { RectangularBoxMarkerBase } from './RectangularBoxMarkerBase';
import { ShapeOutlineMarkerBaseState } from './ShapeOutlineMarkerBaseState';
import { SvgHelper } from './SvgHelper';

export class ShapeOutlineMarkerBase extends RectangularBoxMarkerBase {
  public static title = 'Shape outline marker';

  /**
   * Rectangle stroke color.
   */
  protected _strokeColor = 'transparent';
  public get strokeColor() {
    return this._strokeColor;
  }
  public set strokeColor(color: string) {
    this._strokeColor = color;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke', this._strokeColor]]);
    }
  }

  /**
   * Rectangle border stroke width.
   */
  protected _strokeWidth = 0;
  public get strokeWidth() {
    return this._strokeWidth;
  }
  public set strokeWidth(value) {
    this._strokeWidth = value;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [
        ['stroke-width', this._strokeWidth.toString()],
      ]);
    }
  }

  /**
   * Rectangle border stroke dash array.
   */
  protected _strokeDasharray = '';
  public get strokeDasharray() {
    return this._strokeDasharray;
  }
  public set strokeDasharray(value) {
    this._strokeDasharray = value;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [
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

  public setSize(): void {
    super.setSize();
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['d', this.getPath()]]);
    }
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): ShapeOutlineMarkerBaseState {
    const result: ShapeOutlineMarkerBaseState = Object.assign(
      {
        strokeColor: this._strokeColor,
        strokeWidth: this._strokeWidth,
        strokeDasharray: this._strokeDasharray,
        opacity: this._opacity,
      },
      super.getState(),
    );

    return result;
  }

  /**
   * Restores previously saved marker state.
   *
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    const rectState = state as ShapeOutlineMarkerBaseState;
    this._strokeColor = rectState.strokeColor;
    this._strokeWidth = rectState.strokeWidth;
    this._strokeDasharray = rectState.strokeDasharray;
    this._opacity = rectState.opacity;

    this.createVisual();
    super.restoreState(state);
    this.setSize();
  }

  /**
   * Scales marker. Used after the image resize.
   *
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    this.setSize();
  }
}
