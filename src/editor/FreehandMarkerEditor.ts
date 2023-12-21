import { FreehandMarker, IPoint, SvgHelper } from '../core';
import { ColorType } from './ColorType';
import { MarkerBaseEditor } from './MarkerBaseEditor';
import { MarkerEditorProperties } from './MarkerEditorProperties';

export class FreehandMarkerEditor<
  TMarkerType extends FreehandMarker = FreehandMarker,
> extends MarkerBaseEditor<TMarkerType> {
  /**
   * Pointer coordinates at the start of move or resize.
   */
  protected manipulationStartX = 0;
  protected manipulationStartY = 0;

  /**
   * Container for control elements.
   */
  protected controlBox: SVGGElement = SvgHelper.createGroup();
  private controlRect?: SVGRectElement;

  constructor(properties: MarkerEditorProperties<TMarkerType>) {
    super(properties);

    this.ownsTarget = this.ownsTarget.bind(this);

    this.setupControlBox = this.setupControlBox.bind(this);
    this.adjustControlBox = this.adjustControlBox.bind(this);

    this.manipulate = this.manipulate.bind(this);
    this.pointerDown = this.pointerDown.bind(this);
    this.pointerUp = this.pointerUp.bind(this);

    this.setupControlBox();
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   *
   * @param el - target element.
   */
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

  /**
   * Handles pointer (mouse, touch, stylus, etc.) down event.
   *
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);

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

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   *
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
    this.manipulate(point);
    if (this._state === 'creating') {
      this.finishCreation();
    }
    this.state = 'select';
    this.stateChanged();
  }

  /**
   * Handles marker manipulation (move, resize, rotate, etc.).
   *
   * @param point - event coordinates.
   */
  public manipulate(point: IPoint): void {
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

    this.controlBox.style.display = '';
  }

  protected adjustControlBox() {
    const left = Math.min(...this.marker.points.map((p) => p.x));
    const top = Math.min(...this.marker.points.map((p) => p.y));
    const right = Math.max(...this.marker.points.map((p) => p.x));
    const bottom = Math.max(...this.marker.points.map((p) => p.y));

    if (this.controlRect) {
      SvgHelper.setAttributes(this.controlRect, [
        ['x', (left - this.strokeWidth).toString()],
        ['y', (top  - this.strokeWidth).toString()],
        ['width', (right - left + this.strokeWidth * 2).toString()],
        ['height', (bottom - top + this.strokeWidth * 2).toString()],
      ]);
    }
  }

  /**
   * Displays marker's controls.
   */
  public select(): void {
    super.select();
    this.adjustControlBox();
    this.controlBox.style.display = '';
  }

  /**
   * Hides marker's controls.
   */
  public deselect(): void {
    super.deselect();
    this.controlBox.style.display = 'none';
  }

  /**
   * Sets rectangle's border stroke color.
   * @param color - color as string
   */
  public set strokeColor(color: string) {
    this.marker.strokeColor = color;
    this.colorChanged('stroke', color);
  }

  public get strokeColor(): string {
    return this.marker.strokeColor;
  }

  /**
   * Sets rectangle's border stroke (line) width.
   * @param color - color as string
   */
  public set strokeWidth(width: number) {
    this.marker.strokeWidth = width;
    this.adjustControlBox();
    this.stateChanged();
  }

  public get strokeWidth(): number {
    return this.marker.strokeWidth;
  }

  /**
   * Sets rectangle's border stroke dash array.
   * @param color - color as string
   */
  public set strokeDasharray(dashes: string) {
    this.marker.strokeDasharray = dashes;
    this.stateChanged();
  }

  public get strokeDasharray(): string {
    return this.marker.strokeDasharray;
  }

  /**
   * Method to call when foreground color changes.
   */
  public onColorChanged?: (colorType: ColorType, color: string) => void;

  public colorChanged(colorType: ColorType, color: string): void {
    if (this.onColorChanged) {
      this.onColorChanged(colorType, color);
    }
    this.stateChanged();
  }
}
