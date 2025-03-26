import { FreehandMarkerState } from './FreehandMarkerState';
import { IPoint } from './IPoint';
import { MarkerBase } from './MarkerBase';
import { MarkerBaseState } from './MarkerBaseState';
import { SvgHelper } from './SvgHelper';

/**
 * Freehand marker represents a hand drawing.
 *
 * Unlike v2 in v3 freehand marker is represented by an SVG path element.
 * This means that the line properties like stroke color, width, dasharray, etc.
 * can be modified after drawing.
 *
 * @summary Freehand drawing marker.
 * @group Markers
 */
export class FreehandMarker extends MarkerBase {
  public static typeName = 'FreehandMarker';
  public static title = 'Freehand marker';
  public static applyDefaultFilter = false;

  /**
   * Points of the freehand line.
   */
  public points: IPoint[] = [];

  /**
   * Marker's main visual.
   */
  public visual: SVGGraphicsElement | undefined;

  /**
   * Wider invisible visual to make it easier to select and manipulate the marker.
   */
  protected selectorVisual: SVGGraphicsElement | undefined;
  /**
   * Visible visual of the marker.
   */
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
    if (this.visibleVisual) {
      SvgHelper.setAttributes(this.visibleVisual, [
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

  /**
   * Returns SVG path string representing the freehand line.
   *
   * @returns SVG path string representing the freehand line.
   */
  protected getPath(): string {
    if (this.points.length > 1) {
      return this.points
        .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
        .join(' ');
    }
    return 'M0,0';
  }

  /**
   * Creates the visual elements comprising the marker's visual.
   */
  public createVisual(): void {
    this.visual = SvgHelper.createGroup();
    this.selectorVisual = SvgHelper.createPath(this.getPath(), [
      ['stroke', 'transparent'],
      ['fill', 'transparent'],
      ['stroke-width', Math.max(this.strokeWidth, 8).toString()],
    ]);
    this.visibleVisual = SvgHelper.createPath(this.getPath(), [
      ['stroke', this.strokeColor],
      ['fill', 'transparent'],
      ['stroke-width', this.strokeWidth.toString()],
      ['opacity', this.opacity.toString()],
    ]);
    this.visual.appendChild(this.selectorVisual);
    this.visual.appendChild(this.visibleVisual);

    this.addMarkerVisualToContainer(this.visual);
  }

  /**
   * Adjusts marker visual after manipulation or with new points.
   */
  public adjustVisual(): void {
    if (this.selectorVisual && this.visibleVisual) {
      const path = this.getPath();
      SvgHelper.setAttributes(this.selectorVisual, [['d', path]]);
      SvgHelper.setAttributes(this.visibleVisual, [['d', path]]);

      SvgHelper.setAttributes(this.visibleVisual, [
        ['stroke', this.strokeColor],
        ['stroke-width', this.strokeWidth.toString()],
        ['stroke-dasharray', this.strokeDasharray.toString()],
        ['stroke-dasharray', this.strokeDasharray.toString()],
        ['opacity', this.opacity.toString()],
      ]);
    }
  }

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

  public restoreState(state: MarkerBaseState): void {
    super.restoreState(state);

    const pmState = state as FreehandMarkerState;
    this.points = pmState.points;

    this.createVisual();
    this.adjustVisual();
  }

  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    this.points.forEach((p) => {
      p.x = p.x * scaleX;
      p.y = p.y * scaleY;
    });

    this.adjustVisual();
  }
}
