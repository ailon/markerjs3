import { MarkerBaseState } from "./MarkerBaseState";
import { RectangularBoxMarkerBase } from "./RectangularBoxMarkerBase";
import { ShapeOutlineMarkerBaseState } from "./ShapeOutlineMarkerBaseState";
import { SvgHelper } from "./SvgHelper";

export abstract class ShapeOutlineMarkerBase extends RectangularBoxMarkerBase {
  public static title = 'Shape outline marker';

  /**
   * Rectangle stroke color.
   */
  public strokeColor = 'transparent';
  /**
   * Rectangle border stroke width.
   */
  public strokeWidth = 0;
  /**
   * Rectangle border stroke dash array.
   */
  public strokeDasharray = '';
  /**
   * Rectangle opacity (alpha). 0 to 1.
   */
  protected opacity = 1;

  constructor(container: SVGGElement) {
    super(container);

    this.setStrokeColor = this.setStrokeColor.bind(this);
    this.setStrokeWidth = this.setStrokeWidth.bind(this);
    this.setStrokeDasharray = this.setStrokeDasharray.bind(this);
    this.createVisual = this.createVisual.bind(this);

  }

  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || el === this.visual) {
      return true;
    } else {
      return false;
    }
  }

  protected getPathD(): string {
    return 'M0,0';
  }

  public createVisual(): void {
    this.visual = SvgHelper.createPath(this.getPathD(), [
      ['stroke', this.strokeColor],
      ['stroke-width', this.strokeWidth.toString()],
      ['stroke-dasharray', this.strokeDasharray],
      ['opacity', this.opacity.toString()]
    ]);
    this.addMarkerVisualToContainer(this.visual);
  }

  public setSize(): void {
    super.setSize();
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [
        ['d', this.getPathD()],
      ]);
    }
  }

  /**
   * Sets rectangle's border stroke color.
   * @param color - color as string
   */
  public setStrokeColor(color: string): void {
    this.strokeColor = color;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke', this.strokeColor]]);
    }
  }

  /**
   * Sets rectangle's border stroke (line) width.
   * @param color - color as string
   */
  public setStrokeWidth(width: number): void {
    this.strokeWidth = width;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke-width', this.strokeWidth.toString()]]);
    }
  }
  /**
   * Sets rectangle's border stroke dash array.
   * @param color - color as string
   */
  public setStrokeDasharray(dashes: string): void {
    this.strokeDasharray = dashes;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke-dasharray', this.strokeDasharray]]);
    }
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): ShapeOutlineMarkerBaseState {
    const result: ShapeOutlineMarkerBaseState = Object.assign({
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      strokeDasharray: this.strokeDasharray,
      opacity: this.opacity
    }, super.getState());

    return result;
  }

  /**
   * Restores previously saved marker state.
   * 
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    const rectState = state as ShapeOutlineMarkerBaseState;
    this.strokeColor = rectState.strokeColor;
    this.strokeWidth = rectState.strokeWidth;
    this.strokeDasharray = rectState.strokeDasharray;
    this.opacity = rectState.opacity;

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