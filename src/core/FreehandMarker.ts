import { FreehandMarkerState } from './FreehandMarkerState';
import { IPoint } from './IPoint';
import { MarkerBase } from './MarkerBase';
import { MarkerBaseState } from './MarkerBaseState';
import { SvgHelper } from './SvgHelper';

export class FreehandMarker extends MarkerBase {
  public static typeName = 'FreehandMarker';
  public static title = 'Freehand marker';

  public points: IPoint[] = [];

  /**
   * Marker's main visual.
   */
  public visual: SVGGraphicsElement | undefined;

  protected selectorVisual: SVGGraphicsElement | undefined;
  public visibleVisual: SVGGraphicsElement | undefined;

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

    this.strokeColor = '#ff0000';
    this.strokeWidth = 3;

    this.createVisual = this.createVisual.bind(this);
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
    if (this.points.length > 1) {
      return (
        this.points
          .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
          .join(' ')
      );
    }
    return 'M0,0';
  }

  public createVisual(): void {
    this.visual = SvgHelper.createGroup();
    this.selectorVisual = SvgHelper.createPath(
      this.getPath(),
      [
        ['stroke', 'transparent'],
        ['fill', 'transparent'],
        ['stroke-width', Math.max(this.strokeWidth, 8).toString()],
      ]
    );
    this.visibleVisual = SvgHelper.createPath(this.getPath(), [
      ['stroke', this.strokeColor],
      ['fill', 'transparent'],
      ['stroke-width', this.strokeWidth.toString()],
    ]);
    this.visual.appendChild(this.selectorVisual);
    this.visual.appendChild(this.visibleVisual);

    this.addMarkerVisualToContainer(this.visual);
  }

  /**
   * When implemented adjusts marker visual after manipulation when needed.
   */
  public adjustVisual(): void {
    if (this.selectorVisual && this.visibleVisual) {
      const path = this.getPath();
      SvgHelper.setAttributes(this.selectorVisual, [['d', path]]);
      SvgHelper.setAttributes(this.visibleVisual, [['d', path]]);

      SvgHelper.setAttributes(this.visibleVisual, [
        ['stroke', this.strokeColor],
      ]);
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
  public getState(): FreehandMarkerState {
    const result: FreehandMarkerState = Object.assign(
      {
        points: this.points,
      },
      super.getState(),
    );
    result.typeName = FreehandMarker.typeName;

    return result;
  }

  /**
   * Restores marker's state to the previously saved one.
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    super.restoreState(state);

    const pmState = state as FreehandMarkerState;
    this.points = pmState.points;

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

    this.points.forEach((p) => {
      p.x = p.x * scaleX;
      p.y = p.y * scaleY;
    });

    this.adjustVisual();
  }
}
