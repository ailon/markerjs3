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

  /**
   * Grip's size (radius).
   */
  public gripSize = 5;

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
  }

  /**
   * Creates grip's visual.
   */
  protected createVisual() {
    this._visual = SvgHelper.createGroup();
    this._visual.appendChild(
      SvgHelper.createCircle(this.gripSize * 4, [
        ['fill', 'transparent'],
        ['cx', (this.gripSize / 2).toString()],
        ['cy', (this.gripSize / 2).toString()],
      ]),
    );
    const visual = SvgHelper.createCircle(this.gripSize, [
      ['fill-opacity', '1'],
      ['stroke-width', '1'],
      ['stroke-opacity', '1'],
    ]);
    visual.style.fill = `var(--mjs-grip-fill, ${this.fillColor})`;
    visual.style.stroke = `var(--mjs-grip-stroke, ${this.strokeColor})`;
    visual.style.filter = 'drop-shadow(0px 0px 2px rgba(0, 0, 0, .7))';
    this._visual.appendChild(visual);
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
