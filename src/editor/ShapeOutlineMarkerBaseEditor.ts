import { IPoint, ShapeOutlineMarkerBase } from '../core';
import { ColorType } from './ColorType';
import { RectangularBoxMarkerBaseEditor } from './RectangularBoxMarkerBaseEditor';

export class ShapeOutlineMarkerBaseEditor<
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
  public setStrokeColor(color: string): void {
    this.marker.setStrokeColor(color);
    this.colorChanged('stroke', color);
  }

  public getStrokeColor(): string {
    return this.marker.strokeColor;
  }

  /**
   * Sets rectangle's border stroke (line) width.
   * @param color - color as string
   */
  public setStrokeWidth(width: number): void {
    this.marker.setStrokeWidth(width);
    this.stateChanged();
  }

  public getStrokeWidth(): number {
    return this.marker.strokeWidth;
  }

  /**
   * Sets rectangle's border stroke dash array.
   * @param color - color as string
   */
  public setStrokeDasharray(dashes: string): void {
    this.marker.setStrokeDasharray(dashes);
    this.stateChanged();
  }

  public getStrokeDasharray(): string {
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
