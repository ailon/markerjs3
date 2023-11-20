import { SvgHelper } from '../core/SvgHelper';

/**
 * Represents a single resize-manipulation grip used in marker's manipulation controls.
 */
export class Grip {
  /**
   * Grip's visual element.
   */
  protected _visual?: SVGGraphicsElement;
  public get visual(): SVGGraphicsElement {
    if (!this._visual) {
      this.createVisual();
    }
    return this._visual!;
  }

  /**
   * Grip's size (raduis).
   */
  public gripSize = 5;

  public fillColor = '#0ea5e9';
  public strokeColor = '#ffffff';

  /**
   * Creates a new grip.
   */
  constructor() {
    this.createVisual = this.createVisual.bind(this);
  }

  protected createVisual() {
    this._visual = SvgHelper.createGroup();
    this._visual.appendChild(
      SvgHelper.createCircle(this.gripSize * 4, [
        ['fill', 'transparent'],
        ['cx', (this.gripSize / 2).toString()],
        ['cy', (this.gripSize / 2).toString()],
      ])
    );
    this._visual.appendChild(
      SvgHelper.createCircle(this.gripSize, [
        ['fill', this.fillColor],
        ['fill-opacity', '1'],
        ['stroke', this.strokeColor],
        ['stroke-width', '1'],
        ['stroke-opacity', '1']
      ])
    );
  }

  /**
   * Returns true if passed SVG element belongs to the grip. False otherwise.
   * 
   * @param el - target element.
   */
  public ownsTarget(el: EventTarget): boolean {
    if (
      el === this._visual 
    ) {
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
