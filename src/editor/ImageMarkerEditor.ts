import { ImageMarkerBase, IPoint } from '../core';
import { MarkerEditorProperties } from './MarkerEditorProperties';
import { RectangularBoxMarkerBaseEditor } from './RectangularBoxMarkerBaseEditor';

export class ImageMarkerEditor<
  TMarkerType extends ImageMarkerBase = ImageMarkerBase,
> extends RectangularBoxMarkerBaseEditor<TMarkerType> {
  constructor(properties: MarkerEditorProperties<TMarkerType>) {
    super(properties);

    this._creationStyle = 'drop';

    this.pointerDown = this.pointerDown.bind(this);
    this.pointerUp = this.pointerUp.bind(this);
    this.resize = this.resize.bind(this);
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
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   *
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
    this.setSize();
    this.adjustControlBox();
  }
}
