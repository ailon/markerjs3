import { IPoint, LinearMarkerBase, SvgHelper } from '../core';
import { MarkerBaseEditor } from './MarkerBaseEditor';
import { MarkerEditorProperties } from './MarkerEditorProperties';
import { ResizeGrip } from './ResizeGrip';

/**
 * Editor for linear markers.
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
   * Container for control elements.
   */
  protected controlBox: SVGGElement = SvgHelper.createGroup();
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

    this.setupControlBox();
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

  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);

    this.manipulationStartX = point.x;
    this.manipulationStartY = point.y;

    if (this.state === 'new') {
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

  public pointerUp(point: IPoint): void {
    const inState = this.state;
    super.pointerUp(point);
    if (
      this.state === 'creating' &&
      Math.abs(this.marker.x1 - this.marker.x2) < 10 &&
      Math.abs(this.marker.y1 - this.marker.y2) < 10
    ) {
      this.marker.x2 = this.marker.x1 + this.defaultLength;
      this.marker.adjustVisual();
      this.adjustControlBox();
    } else {
      this.manipulate(point);
    }
    this._state = 'select';
    if (inState === 'creating' && this.onMarkerCreated) {
      this.onMarkerCreated(this);
    }
  }

  public manipulate(point: IPoint): void {
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
    this.controlBox = SvgHelper.createGroup();
    this.container.appendChild(this.controlBox);
    this.manipulationBox = SvgHelper.createGroup();
    this.controlBox.appendChild(this.manipulationBox);

    this.addControlGrips();

    this.controlBox.style.display = 'none';
  }

  protected adjustControlBox() {
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
    this.controlBox.style.display = '';
  }

  public deselect(): void {
    super.deselect();
    this.controlBox.style.display = 'none';
  }
}
