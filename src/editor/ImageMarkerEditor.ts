import { ImageMarkerBase, IPoint } from '../core';
import { MarkerEditorProperties } from './MarkerEditorProperties';
import { RectangularBoxMarkerBaseEditor } from './RectangularBoxMarkerBaseEditor';

/**
 * Editor for image markers.
 *
 * @summary Image marker editor.
 * @group Editors
 */
export class ImageMarkerEditor<
  TMarkerType extends ImageMarkerBase = ImageMarkerBase,
> extends RectangularBoxMarkerBaseEditor<TMarkerType> {
  constructor(properties: MarkerEditorProperties<TMarkerType>) {
    super(properties);

    this._creationStyle = 'drop';

    this.disabledResizeGrips = [
      'topcenter',
      'bottomcenter',
      'leftcenter',
      'rightcenter',
    ];

    this.pointerDown = this.pointerDown.bind(this);
    this.pointerUp = this.pointerUp.bind(this);
    this.resize = this.resize.bind(this);
  }

  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);

    if (this.state === 'new') {
      this.marker.createVisual();

      this.marker.moveVisual(point);

      this._state = 'creating';
    }
  }

  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
    this.setSize();
    this.adjustControlBox();
  }
}
