import { IPoint } from './IPoint';
import { MarkerBase } from './MarkerBase';
import { MarkerBaseState } from './MarkerBaseState';
import { PolygonMarkerState } from './PolygonMarkerState';
import { SvgHelper } from './SvgHelper';

/**
 * Polygon marker is a multi-point marker that represents a polygon.
 */
export class PolygonMarker extends MarkerBase {
  public static typeName = 'PolygonMarker';
  public static title = 'Polygon marker';

  /**
   * Marker's points.
   */
  public points: IPoint[] = [];

  /**
   * Marker's main visual.
   */
  public visual: SVGGraphicsElement | undefined;

  public selectorVisual: SVGGElement | undefined;
  public selectorVisualLines: SVGLineElement[] = [];
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

  public ownsTarget(el: EventTarget): boolean {
    if (
      super.ownsTarget(el) ||
      el === this.visual ||
      el === this.selectorVisual ||
      el === this.visibleVisual ||
      this.selectorVisualLines.some((l) => l === el)
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns SVG path string for the polygon.
   *
   * @returns Path string for the polygon.
   */
  protected getPath(): string {
    if (this.points.length > 1) {
      return (
        this.points
          .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
          .join(' ') + (this.stage !== 'creating' ? ' Z' : '')
      );
    }
    return 'M0,0';
  }

  /**
   * Creates marker's main visual.
   */
  public createVisual(): void {
    this.visual = SvgHelper.createGroup();
    this.visibleVisual = SvgHelper.createPath(this.getPath(), [
      ['stroke', this.strokeColor],
      ['fill', 'transparent'],
      ['stroke-width', this.strokeWidth.toString()],
    ]);
    this.visual.appendChild(this.visibleVisual);

    this.createSelectorVisual();

    this.addMarkerVisualToContainer(this.visual);
  }

  /**
   * Creates selector visual.
   *
   * Selector visual is a transparent wider visual that allows easier selection of the marker.
   */
  private createSelectorVisual() {
    if (this.visual) {
      this.selectorVisual = SvgHelper.createGroup();
      this.visual.appendChild(this.selectorVisual);

      this.points.forEach(() => {
        this.addSelectorLine();
      });
    }
  }

  /**
   * Adjusts marker visual after manipulation when needed.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public adjustVisual(): void {
    if (this.selectorVisual && this.visibleVisual) {
      SvgHelper.setAttributes(this.visibleVisual, [['d', this.getPath()]]);

      SvgHelper.setAttributes(this.visibleVisual, [
        ['stroke', this.strokeColor],
      ]);
      SvgHelper.setAttributes(this.visibleVisual, [
        ['stroke-width', this.strokeWidth.toString()],
      ]);
      SvgHelper.setAttributes(this.visibleVisual, [
        ['stroke-dasharray', this.strokeDasharray.toString()],
      ]);

      this.adjustSelectorVisual();
    }
  }

  private adjustSelectorVisual() {
    if (this.selectorVisual) {
      // adjust number of lines
      const missingLines = this.points.length - this.selectorVisualLines.length;
      if (missingLines > 0) {
        for (let i = 0; i < missingLines; i++) {
          this.addSelectorLine();
        }
      } else if (missingLines < 0) {
        for (let i = 0; i < -missingLines; i++) {
          this.selectorVisual!.removeChild(this.selectorVisualLines.pop()!);
        }
      }

      // adjust line coordinates
      this.selectorVisualLines.forEach((line, i) => {
        SvgHelper.setAttributes(line, [
          ['x1', this.points[i].x.toString()],
          ['y1', this.points[i].y.toString()],
          ['x2', this.points[(i + 1) % this.points.length].x.toString()],
          ['y2', this.points[(i + 1) % this.points.length].y.toString()],
        ]);
      });
    }
  }

  private addSelectorLine() {
    const line = SvgHelper.createLine(0, 0, 0, 0, [
      ['stroke', 'transparent'],
      ['stroke-width', Math.max(this.strokeWidth, 8).toString()],
    ]);
    this.selectorVisual!.appendChild(line);
    this.selectorVisualLines.push(line);
  }

  public getState(): PolygonMarkerState {
    const result: PolygonMarkerState = Object.assign(
      {
        points: this.points,
      },
      super.getState(),
    );
    result.typeName = PolygonMarker.typeName;

    return result;
  }

  public restoreState(state: MarkerBaseState): void {
    super.restoreState(state);

    const pmState = state as PolygonMarkerState;
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
