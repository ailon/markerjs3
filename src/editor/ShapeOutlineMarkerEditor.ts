import { IPoint, ShapeOutlineMarkerBase } from '../core';
import { MarkerEditorProperties } from './MarkerEditorProperties';
import { RectangularBoxMarkerBaseEditor } from './RectangularBoxMarkerBaseEditor';

export class ShapeOutlineMarkerEditor<
  TMarkerType extends ShapeOutlineMarkerBase = ShapeOutlineMarkerBase,
> extends RectangularBoxMarkerBaseEditor<TMarkerType> {

  constructor(properties: MarkerEditorProperties<TMarkerType>) {
    super(properties);

    this._creationStyle = 'draw';
  }

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
}
