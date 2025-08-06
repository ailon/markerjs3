import { IPoint, PolygonMarker, SvgHelper } from '../core';
import { MarkerBaseEditor } from './MarkerBaseEditor';
import { MarkerEditorProperties } from './MarkerEditorProperties';
import { ResizeGrip } from './ResizeGrip';

/**
 * Editor for polygon markers.
 *
 * @summary Polygon marker editor.
 * @group Editors
 */
export class PolygonMarkerEditor<
  TMarkerType extends PolygonMarker = PolygonMarker,
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

  /**
   * Container for control elements.
   */
  protected controlBox?: SVGGElement;
  /**
   * Container for manipulation grips.
   */
  protected manipulationBox: SVGGElement = SvgHelper.createGroup();

  /**
   * Array of manipulation grips.
   */
  protected grips: ResizeGrip[] = [];
  /**
   * Active manipulation grip.
   */
  protected activeGrip?: ResizeGrip;

  constructor(properties: MarkerEditorProperties<TMarkerType>) {
    super(properties);

    this.ownsTarget = this.ownsTarget.bind(this);

    this.setupControlBox = this.setupControlBox.bind(this);
    this.adjustControlBox = this.adjustControlBox.bind(this);

    this.adjustControlGrips = this.adjustControlGrips.bind(this);
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
    } else if (this.grips.some((grip) => grip.ownsTarget(el))) {
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

    this.adjustControlBox();
    this.controlBox!.style.display = '';

    if (this.state === 'new') {
      this.startCreation(point);
    } else if (this._state === 'creating') {
      if (this.grips.length > 0 && target && this.grips[0].ownsTarget(target)) {
        this.finishCreation();
      } else {
        this.addNewPointWhileCreating(point);
      }
    } else {
      this.select(this.isMultiSelected);
      this.activeGrip =
        target && this.grips.find((grip) => grip.ownsTarget(target));

      if (this.activeGrip) {
        this._state = 'resize';
      } else {
        this._state = 'move';
      }
    }
  }

  private startCreation(point: IPoint) {
    this.marker.stage = 'creating';
    this.marker.points.push(point);
    this.marker.points.push(point);
    this.marker.createVisual();
    this.marker.adjustVisual();
    this.adjustControlGrips();
    if (this.controlBox) {
      this.controlBox.style.display = '';
    }

    this.activeGrip = this.grips.at(-1);
    if (this.activeGrip) {
      this.activeGrip.visual.style.pointerEvents = 'none';
    }

    this._state = 'creating';
  }

  private addNewPointWhileCreating(point: IPoint) {
    this.marker.points.push(point);
    this.marker.adjustVisual();
    this.adjustControlGrips();
    this.activeGrip = this.grips.at(-1);
    if (this.activeGrip) {
      this.activeGrip.visual.style.pointerEvents = 'none';
    }
  }

  private finishCreation() {
    this.marker.stage = 'normal';
    // connected the last point with the first one
    // remove the first point
    this.marker.points.splice(0, 1);
    // single point is not a polygon
    if (this.marker.points.length === 1) {
      this.marker.points.splice(0, 1);
    }
    this.marker.adjustVisual();
    this.adjustControlGrips();
    this.grips.forEach((grip) => {
      grip.visual.style.pointerEvents = '';
    });

    this._state = 'select';
    if (this.marker.points.length > 0 && this.onMarkerCreated) {
      this.onMarkerCreated(this);
    }
  }

  public override pointerUp(point: IPoint, ev?: PointerEvent): void {
    super.pointerUp(point, ev);
    this.manipulate(point, ev);
    if (this._state !== 'creating') {
      this._state = 'select';
    }
    this.stateChanged();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override manipulate(point: IPoint, ev?: PointerEvent): void {
    if (this.state === 'creating') {
      this.resize(point);
    } else if (this.state === 'move') {
      this.marker.points.forEach((p) => {
        p.x += point.x - this.manipulationStartX;
        p.y += point.y - this.manipulationStartY;
      });
      this.manipulationStartX = point.x;
      this.manipulationStartY = point.y;
      this.marker.adjustVisual();
      this.adjustControlBox();
    } else if (this.state === 'resize') {
      this.resize(point);
    }
  }

  protected resize(point: IPoint): void {
    const activeGripIndex = this.activeGrip
      ? this.grips.indexOf(this.activeGrip)
      : -1;
    if (activeGripIndex >= 0) {
      this.marker.points[activeGripIndex] = point;
      this.marker.adjustVisual();
      this.adjustControlBox();
    }
  }

  public override dblClick(
    point: IPoint,
    target?: EventTarget,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ev?: MouseEvent,
  ): void {
    if (target && this.state === 'select') {
      const selectorLineIndex = this.marker.selectorVisualLines.findIndex(
        (l) => l === target,
      );
      if (selectorLineIndex > -1) {
        this.marker.points.splice(selectorLineIndex + 1, 0, point);
        this.marker.adjustVisual();
        this.adjustControlGrips();
      } else {
        const gripIndex = this.grips.findIndex((g) => g.ownsTarget(target));
        if (gripIndex > -1) {
          this.marker.points.splice(gripIndex, 1);
          this.marker.adjustVisual();
          this.adjustControlGrips();
        }
      }
    }
  }

  /**
   * Creates control box for manipulation controls.
   */
  protected setupControlBox(): void {
    if (this.controlBox) return;

    this.controlBox = SvgHelper.createGroup();
    this.container.appendChild(this.controlBox);
    this.manipulationBox = SvgHelper.createGroup();
    this.controlBox.appendChild(this.manipulationBox);

    this.adjustControlGrips();

    this.controlBox.style.display = 'none';
  }

  protected adjustControlBox() {
    if (!this.controlBox) {
      this.setupControlBox();
    }
    // this.positionGrips();
    this.adjustControlGrips();
  }

  /**
   * Adds control grips to control box.
   */
  protected adjustControlGrips(): void {
    const noOfMissingGrips = this.marker.points.length - this.grips.length;
    if (noOfMissingGrips > 0) {
      for (let i = 0; i < noOfMissingGrips; i++) {
        this.grips.push(this.createGrip());
      }
    } else if (noOfMissingGrips < 0) {
      for (let i = 0; i < -noOfMissingGrips; i++) {
        const grip = this.grips.pop();
        if (grip) {
          this.manipulationBox.removeChild(grip.visual);
        }
      }
    }

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
    this.grips.forEach((grip, i) => {
      grip.zoomLevel = this.zoomLevel;
      const point = this.marker.points[i];
      this.positionGrip(
        grip.visual,
        point.x - grip.gripSize / 2,
        point.y - grip.gripSize / 2,
      );
    });
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
    this.controlBox!.style.display = '';
  }

  public deselect(): void {
    super.deselect();
    if (this.controlBox) {
      this.controlBox.style.display = 'none';
    }
    if (this.state === 'creating') {
      this.finishCreation();
    }
  }
}
