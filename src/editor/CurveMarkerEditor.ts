import { CurveMarker, IPoint, SvgHelper } from '../core';
import { LinearMarkerEditor } from './LinearMarkerEditor';
import { ResizeGrip } from './ResizeGrip';

export class CurveMarkerEditor<
  TMarkerType extends CurveMarker = CurveMarker,
> extends LinearMarkerEditor<TMarkerType> {
  /**
   * Curve manipulation grip.
   */
  protected curveGrip?: ResizeGrip;

  private manipulationStartCurveX = 0;
  private manipulationStartCurveY = 0;

  private curveControlLine1?: SVGLineElement;
  private curveControlLine2?: SVGLineElement;

  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || this.curveGrip?.ownsTarget(el)) {
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
    if (this.state === 'new') {
      this.marker.curveX = point.x;
      this.marker.curveY = point.y;
    }

    this.manipulationStartCurveX = this.marker.curveX;
    this.manipulationStartCurveY = this.marker.curveY;

    super.pointerDown(point, target, ev);

    if (this.state !== 'new' && this.state !== 'creating') {
      if (target && this.curveGrip?.ownsTarget(target)) {
        this.activeGrip = this.curveGrip;
      }

      if (this.activeGrip) {
        this._state = 'resize';
      } else {
        this._state = 'move';
      }
    }
  }

  protected resize(point: IPoint): void {
    super.resize(point);

    if (this.activeGrip === this.curveGrip) {
      this.marker.curveX = point.x;
      this.marker.curveY = point.y;

      this.marker.adjustVisual();
      this.adjustControlBox();
    }

    if (this.state === 'creating') {
      this.marker.curveX =
        this.marker.x1 + (this.marker.x2 - this.marker.x1) / 2;
      this.marker.curveY =
        this.marker.y1 + (this.marker.y2 - this.marker.y1) / 2;
    }
  }

  public override manipulate(point: IPoint, ev?: PointerEvent): void {
    if (this.state === 'move') {
      this.marker.curveX =
        this.manipulationStartCurveX + point.x - this.manipulationStartX;
      this.marker.curveY =
        this.manipulationStartCurveY + point.y - this.manipulationStartY;
    }
    super.manipulate(point, ev);
  }

  protected setupControlBox(): void {
    super.setupControlBox();

    const strokeWidth = 1 / this.zoomLevel;

    this.curveControlLine1 = SvgHelper.createLine(
      this.marker.x1,
      this.marker.y1,
      this.marker.curveX,
      this.marker.curveY,
      [
        ['stroke', 'black'],
        ['stroke-width', strokeWidth.toString()],
        ['stroke-opacity', '0.5'],
        ['stroke-dasharray', '3, 2'],
        ['fill', 'transparent'],
        ['pointer-events', 'none'],
      ],
    );
    this.curveControlLine2 = SvgHelper.createLine(
      this.marker.x2,
      this.marker.y2,
      this.marker.curveX,
      this.marker.curveY,
      [
        ['stroke', 'black'],
        ['stroke-width', strokeWidth.toString()],
        ['stroke-opacity', '0.5'],
        ['stroke-dasharray', '3, 2'],
        ['fill', 'transparent'],
        ['pointer-events', 'none'],
      ],
    );

    // super creates the control box, so we know it exists
    this._controlBox!.insertBefore(
      this.curveControlLine1,
      this._controlBox!.firstChild,
    );
    this._controlBox!.insertBefore(
      this.curveControlLine2,
      this._controlBox!.firstChild,
    );
  }

  protected adjustControlBox() {
    super.adjustControlBox();

    const strokeWidth = 1 / this.zoomLevel;
    if (this.curveControlLine1 && this.curveControlLine2 && this.curveGrip) {
      this.curveControlLine1.setAttribute('x1', this.marker.x1.toString());
      this.curveControlLine1.setAttribute('y1', this.marker.y1.toString());
      this.curveControlLine1.setAttribute('x2', this.marker.curveX.toString());
      this.curveControlLine1.setAttribute('y2', this.marker.curveY.toString());
      this.curveControlLine1.setAttribute(
        'stroke-width',
        strokeWidth.toString(),
      );

      this.curveControlLine2.setAttribute('x1', this.marker.x2.toString());
      this.curveControlLine2.setAttribute('y1', this.marker.y2.toString());
      this.curveControlLine2.setAttribute('x2', this.marker.curveX.toString());
      this.curveControlLine2.setAttribute('y2', this.marker.curveY.toString());
      this.curveControlLine2.setAttribute(
        'stroke-width',
        strokeWidth.toString(),
      );
      this.curveGrip.zoomLevel = this.zoomLevel;
    }
  }

  protected addControlGrips(): void {
    super.addControlGrips();

    this.curveGrip = this.createGrip();
    this.curveGrip.zoomLevel = this.zoomLevel;
    this.positionGrips();
  }

  protected positionGrips(): void {
    super.positionGrips();

    if (this.curveGrip) {
      const gripSize = this.curveGrip.gripSize;

      this.positionGrip(
        this.curveGrip.visual,
        this.marker.curveX - gripSize / 2,
        this.marker.curveY - gripSize / 2,
      );
    }
  }
}
