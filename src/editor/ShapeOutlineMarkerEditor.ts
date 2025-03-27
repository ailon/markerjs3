import { IPoint, ShapeOutlineMarkerBase } from '../core';
import { MarkerEditorProperties } from './MarkerEditorProperties';
import { RectangularBoxMarkerBaseEditor } from './RectangularBoxMarkerBaseEditor';

/**
 * Editor for shape outline markers.
 *
 * @summary Shape outline (unfilled shape) marker editor.
 * @group Editors
 */
export class ShapeOutlineMarkerEditor<
  TMarkerType extends ShapeOutlineMarkerBase = ShapeOutlineMarkerBase,
> extends RectangularBoxMarkerBaseEditor<TMarkerType> {
  constructor(properties: MarkerEditorProperties<TMarkerType>) {
    super(properties);

    this._creationStyle = 'draw';
  }

  public override pointerDown(
    point: IPoint,
    target?: EventTarget,
    ev?: PointerEvent,
  ): void {
    super.pointerDown(point, target, ev);
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

  public override pointerUp(point: IPoint, ev?: PointerEvent): void {
    super.pointerUp(point, ev);
    this.setSize();
  }
}
