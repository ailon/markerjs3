import { IPoint, ShapeOutlineMarkerBase } from '../core';
import { ColorType } from './ColorType';
import { RectangularBoxMarkerBaseEditor } from './RectangularBoxMarkerBaseEditor';

export class ShapeOutlineMarkerEditor<
  TMarkerType extends ShapeOutlineMarkerBase = ShapeOutlineMarkerBase,
> extends RectangularBoxMarkerBaseEditor<TMarkerType> {

  /**
   * Handles pointer (mouse, touch, stylus, etc.) down event.
   * 
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);
    if (this.state === 'new') {
      this.marker.createVisual();

      this.marker.moveVisual(point);

      this._state = 'creating';
    }
  }

  /**
   * Resizes the marker based on the pointer coordinates.
   * @param point - current pointer coordinates.
   */
  protected resize(point: IPoint): void {
    super.resize(point);
    this.setSize();
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   * 
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
    this.setSize();
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
