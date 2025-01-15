import { CalloutMarker, IPoint, SvgHelper } from '../core';
import { MarkerEditorProperties } from './MarkerEditorProperties';
import { ResizeGrip } from './ResizeGrip';
import { TextMarkerEditor } from './TextMarkerEditor';

/**
 * Editor for callout markers.
 */
export class CalloutMarkerEditor<
  TMarkerType extends CalloutMarker = CalloutMarker,
> extends TextMarkerEditor<TMarkerType> {
  private tipGrip?: ResizeGrip;

  private manipulationStartTipPositionX = 0;
  private manipulationStartTipPositionY = 0;

  constructor(properties: MarkerEditorProperties<TMarkerType>) {
    super(properties);
  }

  protected addControlGrips(): void {
    this.tipGrip = this.createTipGrip();

    super.addControlGrips();
  }

  private createTipGrip(): ResizeGrip {
    const grip = new ResizeGrip();
    grip.visual.transform.baseVal.appendItem(SvgHelper.createTransform());
    this.manipulationBox.appendChild(grip.visual);

    return grip;
  }

  protected positionGrips() {
    super.positionGrips();

    if (this.tipGrip) {
      const tipGripSize = this.tipGrip.gripSize ?? 0;
      this.positionGrip(
        this.tipGrip.visual,
        this.marker.tipPosition.x - tipGripSize / 2,
        this.marker.tipPosition.y - tipGripSize / 2,
      );
    }
  }

  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || this.tipGrip?.ownsTarget(el)) {
      return true;
    } else {
      return false;
    }
  }

  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);

    this.manipulationStartTipPositionX = this.marker.tipPosition.x;
    this.manipulationStartTipPositionY = this.marker.tipPosition.y;

    if (
      this.tipGrip !== undefined &&
      target !== undefined &&
      this.tipGrip.ownsTarget(target)
    ) {
      this.activeGrip = this.tipGrip;
      this._state = 'resize';
    }
  }

  protected resize(point: IPoint): void {
    const newX =
      this.manipulationStartTipPositionX + point.x - this.manipulationStartX;
    const newY =
      this.manipulationStartTipPositionY + point.y - this.manipulationStartY;

    if (this.activeGrip === this.tipGrip) {
      this.marker.tipPosition = { x: newX, y: newY };
      this.adjustControlBox();
    } else {
      super.resize(point);
    }
  }
}
