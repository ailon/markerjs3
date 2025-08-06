import { IPoint, LinearMarkerBase, SvgHelper } from '../core';
import { MarkerBaseEditor } from './MarkerBaseEditor';
import { MarkerEditorProperties } from './MarkerEditorProperties';
import { ResizeGrip } from './ResizeGrip';

/**
 * Editor for linear markers.
 *
 * @summary Editor for line-like markers.
 * @group Editors
 */
export class LinearMarkerEditor<
  TMarkerType extends LinearMarkerBase = LinearMarkerBase,
> extends MarkerBaseEditor<TMarkerType> {
  /**
   * Default line length when marker is created with a simple click (without dragging).
   */
  protected defaultLength = 50;

  /**
   * Pointer X coordinate at the start of move or resize.
   */
  protected manipulationStartX = 0;
  /**
   * Pointer Y coordinate at the start of move or resize.
   */
  protected manipulationStartY = 0;

  private manipulationStartX1 = 0;
  private manipulationStartY1 = 0;
  private manipulationStartX2 = 0;
  private manipulationStartY2 = 0;

  /**
   * Container for manipulation grips.
   */
  protected manipulationBox: SVGGElement = SvgHelper.createGroup();

  /**
   * First manipulation grip
   */
  protected grip1?: ResizeGrip;
  /**
   * Second manipulation grip.
   */
  protected grip2?: ResizeGrip;
  /**
   * Active manipulation grip.
   */
  protected activeGrip?: ResizeGrip;

  constructor(properties: MarkerEditorProperties<TMarkerType>) {
    super(properties);

    this.ownsTarget = this.ownsTarget.bind(this);

    this.setupControlBox = this.setupControlBox.bind(this);
    this.adjustControlBox = this.adjustControlBox.bind(this);

    this.addControlGrips = this.addControlGrips.bind(this);
    this.createGrip = this.createGrip.bind(this);
    this.positionGrip = this.positionGrip.bind(this);
    this.positionGrips = this.positionGrips.bind(this);

    this.resize = this.resize.bind(this);

    this.manipulate = this.manipulate.bind(this);
    this.pointerDown = this.pointerDown.bind(this);
    this.pointerUp = this.pointerUp.bind(this);
  }

  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || this.marker.ownsTarget(el)) {
      return true;
    } else if (this.grip1?.ownsTarget(el) || this.grip2?.ownsTarget(el)) {
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
    super.pointerDown(point, target, ev);

    this.manipulationStartX = point.x;
    this.manipulationStartY = point.y;

    if (this.state === 'new') {
      this.setupControlBox();
      this.marker.x1 = point.x;
      this.marker.y1 = point.y;
      this.marker.x2 = point.x;
      this.marker.y2 = point.y;
    }

    this.manipulationStartX1 = this.marker.x1;
    this.manipulationStartY1 = this.marker.y1;
    this.manipulationStartX2 = this.marker.x2;
    this.manipulationStartY2 = this.marker.y2;

    if (this.state === 'new') {
      this.marker.createVisual();
      this.marker.adjustVisual();

      this._state = 'creating';
    } else {
      this.select(this.isMultiSelected);
      if (target && this.grip1?.ownsTarget(target)) {
        this.activeGrip = this.grip1;
      } else if (target && this.grip2?.ownsTarget(target)) {
        this.activeGrip = this.grip2;
      } else {
        this.activeGrip = undefined;
      }

      if (this.activeGrip) {
        this._state = 'resize';
      } else {
        this._state = 'move';
      }
    }
  }

  public override pointerUp(point: IPoint, ev?: PointerEvent): void {
    const inState = this.state;
    super.pointerUp(point, ev);
    if (
      this.state === 'creating' &&
      Math.abs(this.marker.x1 - this.marker.x2) < 10 &&
      Math.abs(this.marker.y1 - this.marker.y2) < 10
    ) {
      this.marker.x2 = this.marker.x1 + this.defaultLength;
      this.marker.adjustVisual();
      this.adjustControlBox();
    } else {
      this.manipulate(point, ev);
    }
    this._state = 'select';
    if (inState === 'creating' && this.onMarkerCreated) {
      this.onMarkerCreated(this);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override manipulate(point: IPoint, ev?: PointerEvent): void {
    if (this.state === 'creating') {
      this.resize(point);
    } else if (this.state === 'move') {
      this.marker.x1 =
        this.manipulationStartX1 + point.x - this.manipulationStartX;
      this.marker.y1 =
        this.manipulationStartY1 + point.y - this.manipulationStartY;
      this.marker.x2 =
        this.manipulationStartX2 + point.x - this.manipulationStartX;
      this.marker.y2 =
        this.manipulationStartY2 + point.y - this.manipulationStartY;
      this.marker.adjustVisual();
      this.adjustControlBox();
    } else if (this.state === 'resize') {
      this.resize(point);
    }
  }

  protected resize(point: IPoint): void {
    switch (this.activeGrip) {
      case this.grip1:
        this.marker.x1 = point.x;
        this.marker.y1 = point.y;
        break;
      case this.grip2:
      case undefined:
        this.marker.x2 = point.x;
        this.marker.y2 = point.y;
        break;
    }
    this.marker.adjustVisual();
    this.adjustControlBox();
  }

  /**
   * Creates control box for manipulation controls.
   */
  protected setupControlBox(): void {
    if (this._controlBox) return;

    this._controlBox = SvgHelper.createGroup();
    this.container.appendChild(this._controlBox);
    this.manipulationBox = SvgHelper.createGroup();
    this._controlBox.appendChild(this.manipulationBox);

    this.addControlGrips();

    this._controlBox.style.display = 'none';
  }

  protected adjustControlBox() {
    if (!this._controlBox) {
      this.setupControlBox();
    }
    this.positionGrips();
  }

  /**
   * Adds control grips to control box.
   */
  protected addControlGrips(): void {
    this.grip1 = this.createGrip();
    this.grip2 = this.createGrip();

    this.positionGrips();
  }

  /**
   * Creates manipulation grip.
   * @returns - manipulation grip.
   */
  protected createGrip(): ResizeGrip {
    const grip = new ResizeGrip();
    grip.zoomLevel = this.zoomLevel;
    grip.visual.transform.baseVal.appendItem(SvgHelper.createTransform());
    this.manipulationBox.appendChild(grip.visual);

    return grip;
  }

  /**
   * Updates manipulation grip layout.
   */
  protected positionGrips(): void {
    if (this.grip1 && this.grip2) {
      const gripSize = this.grip1.gripSize;

      this.positionGrip(
        this.grip1.visual,
        this.marker.x1 - gripSize / 2,
        this.marker.y1 - gripSize / 2,
      );
      this.positionGrip(
        this.grip2.visual,
        this.marker.x2 - gripSize / 2,
        this.marker.y2 - gripSize / 2,
      );

      this.grip1.zoomLevel = this.zoomLevel;
      this.grip2.zoomLevel = this.zoomLevel;
    }
  }

  /**
   * Positions manipulation grip.
   * @param grip - grip to position
   * @param x - new X coordinate
   * @param y - new Y coordinate
   */
  protected positionGrip(grip: SVGGraphicsElement, x: number, y: number): void {
    const translate = grip.transform.baseVal.getItem(0);
    translate.setTranslate(x, y);
    grip.transform.baseVal.replaceItem(translate, 0);
  }

  public select(multi = false): void {
    super.select(multi);
    this.adjustControlBox();
    this.manipulationBox.style.display = multi ? 'none' : '';
    this._controlBox!.style.display = '';
  }

  public deselect(): void {
    super.deselect();
    if (this._controlBox) {
      this._controlBox.style.display = 'none';
    }
  }
}
