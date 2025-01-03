import { ISize } from './ISize';
import { MarkerBaseState } from './MarkerBaseState';

export type MarkerStage = 'creating' | 'normal';

export class MarkerBase {
  public static typeName = 'MarkerBase';

  public get typeName(): string {
    return Object.getPrototypeOf(this).constructor.typeName;
  }

  protected _container: SVGGElement;
  /**
   * SVG container object holding the marker's visual.
   */
  public get container(): SVGGElement {
    return this._container;
  }

  /**
   * Additional information about the marker
   */
  public notes?: string;

  /**
   * The default marker size when the marker is created with a click (without dragging).
   */
  public defaultSize: ISize = { width: 50, height: 20 };

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title: string;

  public stage: MarkerStage = 'normal';

  protected _strokeColor = 'transparent';
  public get strokeColor() {
    return this._strokeColor;
  }
  public set strokeColor(color: string) {
    this._strokeColor = color;
    this.applyStrokeColor();
  }
  protected applyStrokeColor() {}

  protected _fillColor = 'transparent';
  public get fillColor() {
    return this._fillColor;
  }
  public set fillColor(color: string) {
    this._fillColor = color;
    this.applyFillColor();
  }
  protected applyFillColor() {}

  protected _strokeWidth = 0;
  public get strokeWidth() {
    return this._strokeWidth;
  }
  public set strokeWidth(value) {
    this._strokeWidth = value;
    this.applyStrokeWidth();
  }
  protected applyStrokeWidth() {}

  protected _strokeDasharray = '';
  public get strokeDasharray() {
    return this._strokeDasharray;
  }
  public set strokeDasharray(value) {
    this._strokeDasharray = value;
    this.applyStrokeDasharray();
  }
  protected applyStrokeDasharray() {}

  protected _opacity = 1;
  public get opacity() {
    return this._opacity;
  }
  public set opacity(value) {
    this._opacity = value;
    this.applyOpacity();
  }
  protected applyOpacity() {}

  constructor(container: SVGGElement) {
    this._container = container;

    this.applyFillColor = this.applyFillColor.bind(this);
    this.applyStrokeColor = this.applyStrokeColor.bind(this);
    this.applyStrokeWidth = this.applyStrokeWidth.bind(this);
    this.applyStrokeDasharray = this.applyStrokeDasharray.bind(this);
    this.applyOpacity = this.applyOpacity.bind(this);
    this.getBBox = this.getBBox.bind(this);
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   *
   * @param el - target element.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ownsTarget(el: EventTarget): boolean {
    return false;
  }

  /**
   * Disposes the marker and clean's up.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public dispose(): void {}

  protected addMarkerVisualToContainer(element: SVGElement): void {
    if (this.container.childNodes.length > 0) {
      this.container.insertBefore(element, this.container.childNodes[0]);
    } else {
      this.container.appendChild(element);
    }
  }

  public getOutline(): string {
    return '';
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): MarkerBaseState {
    return {
      typeName: Object.getPrototypeOf(this).constructor.typeName,
      notes: this.notes,
      strokeColor: this._strokeColor,
      strokeWidth: this._strokeWidth,
      strokeDasharray: this._strokeDasharray,
      opacity: this._opacity,
    };
  }

  /**
   * Restores previously saved marker state.
   *
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    this.notes = state.notes;
    this._strokeColor = state.strokeColor ?? this._strokeColor;
    this._strokeWidth = state.strokeWidth ?? this._strokeWidth;
    this._strokeDasharray = state.strokeDasharray ?? this._strokeDasharray;
    this._opacity = state.opacity ?? this._opacity;
  }

  /**
   * Scales marker. Used after the image resize.
   *
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public scale(scaleX: number, scaleY: number): void {}

  /**
   * Returns markers bounding box.
   *
   * Override to return a custom bounding box.
   *
   * @returns rectangle fitting the marker.
   */
  public getBBox(): DOMRect {
    return this.container.getBBox();
  }
}
