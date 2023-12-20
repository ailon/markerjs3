import { IPoint, PolygonMarker, SvgHelper } from '../core';
import { ColorType } from './ColorType';
import { MarkerBaseEditor } from './MarkerBaseEditor';
import { MarkerEditorProperties } from './MarkerEditorProperties';
import { ResizeGrip } from './ResizeGrip';

export class PolygonMarkerEditor<
  TMarkerType extends PolygonMarker = PolygonMarker,
> extends MarkerBaseEditor<TMarkerType> {
  /**
   * Default line length when marker is created with a simple click (without dragging).
   */
  protected defaultLength = 50;

  /**
   * Pointer coordinates at the start of move or resize.
   */
  protected manipulationStartX = 0;
  protected manipulationStartY = 0;

  /**
   * Container for control elements.
   */
  protected controlBox: SVGGElement = SvgHelper.createGroup();

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

    this.setupControlBox();
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   *
   * @param el - target element.
   */
  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || this.marker.ownsTarget(el)) {
      return true;
    } else if (this.grips.some((grip) => grip.ownsTarget(el))) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) down event.
   *
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);

    this.manipulationStartX = point.x;
    this.manipulationStartY = point.y;

    if (this.state === 'new') {
      this.startCreation(point);
    } else if (this._state === 'creating') {
      if (this.grips.length > 0 && target && this.grips[0].ownsTarget(target)) {
        this.finishCreation();
      } else {
        this.addNewPointWhileCreating(point);
      }
    } else {
      this.select();
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
    // remove the last point and adjust grips
    this.marker.points.pop();
    this.marker.adjustVisual();
    this.adjustControlGrips();
    this.grips.forEach((grip) => {
      grip.visual.style.pointerEvents = '';
    });

    this._state = 'select';
    if (this.onMarkerCreated) {
      this.onMarkerCreated(this);
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
    this.manipulate(point);
    if (this._state !== 'creating') {
      this._state = 'select';
    }
    this.stateChanged();
  }

  /**
   * Handles marker manipulation (move, resize, rotate, etc.).
   *
   * @param point - event coordinates.
   */
  public manipulate(point: IPoint): void {
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

  /**
   * Resizes the line marker.
   * @param point - current manipulation coordinates.
   */
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

  public dblClick(point: IPoint, target?: EventTarget | undefined): void {
    if (target && this.state === 'select') {
      const selectorLineIndex = this.marker.selectorVisualLines.findIndex((l) => l === target);
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
    this.controlBox = SvgHelper.createGroup();
    this.container.appendChild(this.controlBox);

    this.adjustControlGrips();

    this.controlBox.style.display = '';
  }

  protected adjustControlBox() {
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
          this.controlBox.removeChild(grip.visual);
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
    grip.visual.transform.baseVal.appendItem(SvgHelper.createTransform());
    this.controlBox.appendChild(grip.visual);

    return grip;
  }

  /**
   * Updates manipulation grip layout.
   */
  protected positionGrips(): void {
    this.grips.forEach((grip, i) => {
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

  /**
   * Displays marker's controls.
   */
  public select(): void {
    super.select();
    this.adjustControlBox();
    this.controlBox.style.display = '';
  }

  /**
   * Hides marker's controls.
   */
  public deselect(): void {
    super.deselect();
    this.controlBox.style.display = 'none';
  }

  /**
   * Sets rectangle's border stroke color.
   * @param color - color as string
   */
  public set strokeColor(color: string) {
    this.marker.strokeColor = color;
    this.colorChanged('stroke', color);
  }

  public get strokeColor(): string {
    return this.marker.strokeColor;
  }

  /**
   * Sets rectangle's border stroke (line) width.
   * @param color - color as string
   */
  public set strokeWidth(width: number) {
    this.marker.strokeWidth = width;
    this.stateChanged();
  }

  public get strokeWidth(): number {
    return this.marker.strokeWidth;
  }

  /**
   * Sets rectangle's border stroke dash array.
   * @param color - color as string
   */
  public set strokeDasharray(dashes: string) {
    this.marker.strokeDasharray = dashes;
    this.stateChanged();
  }

  public get strokeDasharray(): string {
    return this.marker.strokeDasharray;
  }

  /**
   * Method to call when foreground color changes.
   */
  public onColorChanged?: (colorType: ColorType, color: string) => void;

  public colorChanged(colorType: ColorType, color: string): void {
    if (this.onColorChanged) {
      this.onColorChanged(colorType, color);
    }
    this.stateChanged();
  }
}
