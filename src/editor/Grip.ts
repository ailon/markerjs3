import { SvgHelper } from '../core/SvgHelper';

/**
 * Represents location of the manipulation grips.
 */
export type GripLocation =
  | 'topleft'
  | 'topcenter'
  | 'topright'
  | 'leftcenter'
  | 'rightcenter'
  | 'bottomleft'
  | 'bottomcenter'
  | 'bottomright';

/**
 * Represents a single resize-manipulation grip used in marker's manipulation controls.
 */
export class Grip {
  /**
   * Grip's visual element.
   */
  protected _visual?: SVGGraphicsElement;
  /**
   * Grip's visual element.
   */
  public get visual(): SVGGraphicsElement {
    if (!this._visual) {
      this.createVisual();
    }
    return this._visual!;
  }

  private _selectorElement?: SVGGraphicsElement;
  private _visibleElement?: SVGGraphicsElement;

  /**
   * Grip's size (radius).
   */
  public gripSize = 5;

  private _zoomLevel = 1;

  /**
   * Returns the current zoom level.
   *
   * @remarks
   * This set by the MarkerArea based on its current zoom level.
   *
   * @since 3.6.0
   */
  public get zoomLevel(): number {
    return this._zoomLevel;
  }

  /**
   * Sets the current zoom level.
   *
   * @remarks
   * This set by the MarkerArea based on its current zoom level.
   *
   * @since 3.6.0
   */
  public set zoomLevel(value: number) {
    this._zoomLevel = value;
    this.adjustVisual();
  }

  /**
   * Grip's fill color.
   */
  public fillColor = 'rgba(255,255,255,0.9)';
  /**
   * Grip's stroke color.
   */
  public strokeColor = '#0ea5e9';

  /**
   * Creates a new grip.
   */
  constructor() {
    this.createVisual = this.createVisual.bind(this);
    this.adjustVisual = this.adjustVisual.bind(this);
  }

  /**
   * Creates grip's visual.
   */
  protected createVisual() {
    this._visual = SvgHelper.createGroup();
    this._selectorElement = SvgHelper.createCircle(this.gripSize * 2, [
      ['fill', 'transparent'],
      ['cx', (this.gripSize / 2).toString()],
      ['cy', (this.gripSize / 2).toString()],
    ]);
    this._visual.appendChild(this._selectorElement);
    this._visibleElement = SvgHelper.createCircle(this.gripSize, [
      ['fill-opacity', '1'],
      ['stroke-width', '1'],
      ['stroke-opacity', '1'],
    ]);
    this._visibleElement.style.fill = `var(--mjs-grip-fill, ${this.fillColor})`;
    this._visibleElement.style.stroke = `var(--mjs-grip-stroke, ${this.strokeColor})`;
    this._visibleElement.style.filter =
      'drop-shadow(0px 0px 2px rgba(0, 0, 0, .7))';
    this._visual.appendChild(this._visibleElement);
  }

  protected adjustVisual() {
    if (this._selectorElement && this._visibleElement) {
      this._selectorElement.setAttribute(
        'r',
        ((this.gripSize * 2) / this.zoomLevel).toString(),
      );
      this._visibleElement.setAttribute(
        'r',
        (this.gripSize / this.zoomLevel).toString(),
      );
      this._visibleElement.setAttribute(
        'stroke-width',
        (1 / this.zoomLevel).toString(),
      );
    }
  }

  /**
   * Returns true if passed SVG element belongs to the grip. False otherwise.
   *
   * @param el - target element.
   */
  public ownsTarget(el: EventTarget): boolean {
    if (el === this._visual) {
      return true;
    } else {
      let found = false;
      this._visual?.childNodes.forEach((child) => {
        if (child === el) {
          found = true;
        }
      });
      return found;
    }
  }
}
