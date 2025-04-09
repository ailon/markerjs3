import { LinearMarkerBaseState } from './LinearMarkerBaseState';
import { MarkerBase } from './MarkerBase';
import { MarkerBaseState } from './MarkerBaseState';
import { SvgHelper } from './SvgHelper';

/**
 * Base class for line-like markers.
 *
 * Use one of the derived classes.
 *
 * @summary Base class for line-like markers.
 * @group Markers
 */
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

  /**
   * Wider invisible visual to make it easier to select and manipulate the marker.
   */
  protected selectorVisual: SVGGraphicsElement | undefined;
  /**
   * Visible visual of the marker.
   */
  protected visibleVisual: SVGGraphicsElement | undefined;
  /**
   * Line visual of the marker.
   */
  protected lineVisual: SVGGraphicsElement | undefined;
  /**
   * Start terminator (ending) visual of the marker.
   */
  protected startTerminatorVisual: SVGGraphicsElement | undefined;
  /**
   * End terminator (ending) visual of the marker.
   */
  protected endTerminatorVisual: SVGGraphicsElement | undefined;

  protected applyStrokeColor() {
    if (this.lineVisual) {
      SvgHelper.setAttributes(this.lineVisual, [['stroke', this._strokeColor]]);
    }
    if (this.startTerminatorVisual && this.endTerminatorVisual) {
      SvgHelper.setAttributes(this.startTerminatorVisual, [
        ['stroke', this._strokeColor],
        ['fill', this._strokeColor],
      ]);
      SvgHelper.setAttributes(this.endTerminatorVisual, [
        ['stroke', this._strokeColor],
        ['fill', this._strokeColor],
      ]);
    }
  }

  protected applyStrokeWidth() {
    if (this.lineVisual) {
      SvgHelper.setAttributes(this.lineVisual, [
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
    if (this.lineVisual) {
      SvgHelper.setAttributes(this.lineVisual, [
        ['stroke-dasharray', this._strokeDasharray],
      ]);
    }
  }

  protected applyOpacity() {
    if (this.visibleVisual) {
      SvgHelper.setAttributes(this.visibleVisual, [
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

  public ownsTarget(el: EventTarget): boolean {
    if (
      super.ownsTarget(el) ||
      el === this.visual ||
      el === this.selectorVisual ||
      el === this.visibleVisual ||
      el === this.lineVisual ||
      el === this.startTerminatorVisual ||
      el === this.endTerminatorVisual
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * The path representing the line part of the marker visual.
   *
   * When implemented in derived class should return SVG path for the marker.
   *
   * @returns SVG path for the marker.
   */
  protected getPath(): string {
    return 'M0,0';
  }

  /**
   * The path representing the start terminator (ending) part of the marker visual.
   * @returns SVG path
   */
  protected getStartTerminatorPath(): string {
    return '';
  }

  /**
   * The path representing the end terminator (ending) part of the marker visual.
   * @returns SVG path
   */
  protected getEndTerminatorPath(): string {
    return '';
  }

  /**
   * Creates marker's visual.
   */
  public createVisual(): void {
    this.visual = SvgHelper.createGroup();
    this.selectorVisual = SvgHelper.createPath(this.getPath(), [
      ['stroke', 'transparent'],
      ['fill', 'transparent'],
      ['stroke-width', Math.max(this.strokeWidth, 8).toString()],
    ]);

    this.visibleVisual = SvgHelper.createGroup([
      ['opacity', this.opacity.toString()],
    ]);
    this.lineVisual = SvgHelper.createPath(this.getPath(), [
      ['stroke', this.strokeColor],
      ['fill', this.strokeColor],
      ['stroke-width', this.strokeWidth.toString()],
      ['stroke-linejoin', 'round'],
      ['stroke-dasharray', this.strokeDasharray.toString()],
    ]);
    this.startTerminatorVisual = SvgHelper.createPath(
      this.getStartTerminatorPath(),
      [
        ['stroke', this.strokeColor],
        ['fill', this.strokeColor],
        ['stroke-width', this.strokeWidth.toString()],
        ['stroke-linejoin', 'round'],
      ],
    );
    this.endTerminatorVisual = SvgHelper.createPath(
      this.getEndTerminatorPath(),
      [
        ['stroke', this.strokeColor],
        ['fill', this.strokeColor],
        ['stroke-width', this.strokeWidth.toString()],
        ['stroke-linejoin', 'round'],
      ],
    );

    this.visibleVisual.appendChild(this.lineVisual);
    this.visibleVisual.appendChild(this.startTerminatorVisual);
    this.visibleVisual.appendChild(this.endTerminatorVisual);

    this.visual.appendChild(this.selectorVisual);
    this.visual.appendChild(this.visibleVisual);

    this.addMarkerVisualToContainer(this.visual);
  }

  /**
   * Adjusts marker visual after manipulation when needed.
   */
  public adjustVisual(): void {
    if (
      this.selectorVisual &&
      this.visibleVisual &&
      this.lineVisual &&
      this.startTerminatorVisual &&
      this.endTerminatorVisual
    ) {
      SvgHelper.setAttributes(this.selectorVisual, [['d', this.getPath()]]);
      SvgHelper.setAttributes(this.visibleVisual, [
        ['opacity', this.opacity.toString()],
      ]);
      SvgHelper.setAttributes(this.lineVisual, [
        ['d', this.getPath()],
        ['stroke', this.strokeColor],
        ['fill', this.fillColor],
        ['stroke-width', this.strokeWidth.toString()],
        ['stroke-dasharray', this.strokeDasharray.toString()],
      ]);
      SvgHelper.setAttributes(this.startTerminatorVisual, [
        ['d', this.getStartTerminatorPath()],
        ['stroke', this.strokeColor],
        ['fill', this.strokeColor],
        ['stroke-width', this.strokeWidth.toString()],
      ]);
      SvgHelper.setAttributes(this.endTerminatorVisual, [
        ['d', this.getEndTerminatorPath()],
        ['stroke', this.strokeColor],
        ['fill', this.strokeColor],
        ['stroke-width', this.strokeWidth.toString()],
      ]);
    }
  }

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

  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    this.x1 = this.x1 * scaleX;
    this.y1 = this.y1 * scaleY;
    this.x2 = this.x2 * scaleX;
    this.y2 = this.y2 * scaleY;

    this.strokeWidth *= (scaleX + scaleY) / 2;

    this.adjustVisual();
  }
}
