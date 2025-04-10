import { FreehandMarker, IPoint, SvgHelper } from '../core';
import { MarkerBaseEditor } from './MarkerBaseEditor';
import { MarkerEditorProperties } from './MarkerEditorProperties';

/**
 * Editor for freehand markers.
 *
 * @summary Freehand marker editor.
 * @group Editors
 */
export class FreehandMarkerEditor<
  TMarkerType extends FreehandMarker = FreehandMarker,
> extends MarkerBaseEditor<TMarkerType> {
  /**
   * Pointer X coordinate at the start of move or resize.
   */
  protected manipulationStartX = 0;
  /**
   * Pointer Y coordinate at the start of move or resize.
   */
  protected manipulationStartY = 0;

  /**
   * Container for control elements.
   */
  protected controlBox: SVGGElement = SvgHelper.createGroup();
  private controlRect?: SVGRectElement;

  constructor(properties: MarkerEditorProperties<TMarkerType>) {
    super(properties);

    this._continuousCreation = true;

    this.ownsTarget = this.ownsTarget.bind(this);

    this.setupControlBox = this.setupControlBox.bind(this);
    this.adjustControlBox = this.adjustControlBox.bind(this);

    this.manipulate = this.manipulate.bind(this);
    this.pointerDown = this.pointerDown.bind(this);
    this.pointerUp = this.pointerUp.bind(this);

    this.setupControlBox();
  }

  public ownsTarget(el: EventTarget): boolean {
    if (
      super.ownsTarget(el) ||
      this.marker.ownsTarget(el) ||
      el === this.controlRect
    ) {
      return true;
    } else {
      return false;
    }
  }

  public override pointerDown(
    point: IPoint,
    target?: EventTarget,
    ev?: PointerEvent,
  ): void {
    super.pointerDown(point, target, ev);

    this.manipulationStartX = point.x;
    this.manipulationStartY = point.y;

    if (this.state === 'new') {
      this.startCreation(point);
    } else if (this.state !== 'move') {
      this.select();
      this._state = 'move';
    }
  }

  private startCreation(point: IPoint) {
    this.marker.stage = 'creating';
    this.marker.points.push(point);
    this.marker.createVisual();
    this.marker.adjustVisual();
    this._state = 'creating';
  }

  private addNewPointWhileCreating(point: IPoint) {
    this.marker.points.push(point);
    this.marker.adjustVisual();
  }

  private finishCreation() {
    this.marker.stage = 'normal';
    this.marker.adjustVisual();
    this._state = 'select';
    if (this.onMarkerCreated) {
      this.onMarkerCreated(this);
    }
  }

  public override pointerUp(point: IPoint, ev?: PointerEvent): void {
    super.pointerUp(point, ev);
    this.manipulate(point, ev);
    if (this._state === 'creating') {
      this.finishCreation();
    }
    this.state = 'select';
    this.stateChanged();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override manipulate(point: IPoint, ev?: PointerEvent): void {
    if (this.state === 'creating') {
      this.addNewPointWhileCreating(point);
    } else if (this.state === 'move') {
      this.marker.points.forEach((p) => {
        p.x += point.x - this.manipulationStartX;
        p.y += point.y - this.manipulationStartY;
      });
      this.manipulationStartX = point.x;
      this.manipulationStartY = point.y;
      this.marker.adjustVisual();
      this.adjustControlBox();
    }
  }

  /**
   * Creates control box for manipulation controls.
   */
  protected setupControlBox(): void {
    this.controlBox = SvgHelper.createGroup();
    this.container.appendChild(this.controlBox);

    this.controlRect = SvgHelper.createRect(0, 0, [
      ['stroke', 'black'],
      ['stroke-width', '1'],
      ['stroke-opacity', '0.5'],
      ['stroke-dasharray', '3, 2'],
      ['fill', 'transparent'],
    ]);

    this.controlBox.appendChild(this.controlRect);

    this.controlBox.style.display = 'none';
  }

  protected adjustControlBox() {
    const left = Math.min(...this.marker.points.map((p) => p.x));
    const top = Math.min(...this.marker.points.map((p) => p.y));
    const right = Math.max(...this.marker.points.map((p) => p.x));
    const bottom = Math.max(...this.marker.points.map((p) => p.y));

    if (this.controlRect) {
      SvgHelper.setAttributes(this.controlRect, [
        ['x', (left - this.strokeWidth).toString()],
        ['y', (top - this.strokeWidth).toString()],
        ['width', (right - left + this.strokeWidth * 2).toString()],
        ['height', (bottom - top + this.strokeWidth * 2).toString()],
      ]);
    }
  }

  public select(): void {
    super.select();
    this.adjustControlBox();
    this.controlBox.style.display = '';
  }

  public deselect(): void {
    super.deselect();
    this.controlBox.style.display = 'none';
  }
}
