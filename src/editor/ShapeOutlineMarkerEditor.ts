import { IPoint, ShapeOutlineMarkerBase } from '../core';
import { MarkerEditorProperties } from './MarkerEditorProperties';
import { RectangularBoxMarkerBaseEditor } from './RectangularBoxMarkerBaseEditor';

/**
 * Editor for shape outline markers.
 */
export class ShapeOutlineMarkerEditor<
  TMarkerType extends ShapeOutlineMarkerBase = ShapeOutlineMarkerBase,
> extends RectangularBoxMarkerBaseEditor<TMarkerType> {
  constructor(properties: MarkerEditorProperties<TMarkerType>) {
    super(properties);

    this._creationStyle = 'draw';
  }

  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);
    if (this.state === 'new') {
      this.marker.createVisual();

      this.marker.moveVisual(point);

      this._state = 'creating';
    }
  }

  protected resize(point: IPoint): void {
    super.resize(point);
    this.setSize();
  }

  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
    this.setSize();
  }
}
