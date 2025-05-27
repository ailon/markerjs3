import { ISize } from './ISize';
import { MarkerBaseState } from './MarkerBaseState';

/**
 * Represents a stage in a marker's lifecycle.
 *
 * Most markers are created immediately after the user clicks on the canvas.
 * However, some markers are only finished creating after additional interactions.
 */
export type MarkerStage = 'creating' | 'normal';

/**
 * Base class for all markers.
 *
 * When creating custom marker types usually you will want to extend one of the derived classes.
 * However, if you cannot find a suitable base class, you can and you should extend this class.
 *
 * @summary Base class for all markers.
 * @group Markers
 */
export class MarkerBase {
  /**
   * Marker type name.
   *
   * It's important to set this in each derived class. This value is used to identify marker types
   * when restoring marker state and other scenarios.
   */
  public static typeName = 'MarkerBase';

  /**
   * Returns marker type name for the object instance.
   */
  public get typeName(): string {
    return Object.getPrototypeOf(this).constructor.typeName;
  }

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title: string;

  /**
   * When true, the default filter is applied to the marker's visual.
   *
   * @since 3.2.0
   */
  public static applyDefaultFilter: boolean = true;

  /**
   * SVG container object holding the marker's visual.
   *
   * It is created and passed to the constructor by marker editor or viewer when creating the marker.
   */
  protected _container: SVGGElement;
  /**
   * SVG container object holding the marker's visual.
   */
  /**
   * SVG container object holding the marker's visual.
   */
  public get container(): SVGGElement {
    return this._container;
  }

  /**
   * Additional information about the marker.
   *
   * Generally, this isn't used for anything functional.
   * However, in a derived type it could be used for storing arbitrary data with no need to create extra properties and state types.
   */
  public notes?: string;

  /**
   * The default marker size when the marker is created with a click (without dragging).
   */
  public defaultSize: ISize = { width: 50, height: 20 };

  /**
   * Marker lifecycle stage.
   *
   * Most markers are created immediately after the user clicks on the canvas (`normal`).
   * However, some markers are only finished creating after additional interactions (`creating`).
   */
  public stage: MarkerStage = 'normal';

  /**
   * Stroke (outline) color of the marker.
   */
  protected _strokeColor = 'transparent';
  /**
   * Stroke (outline) color of the marker.
   *
   * In a derived class override {@link applyStrokeColor} to apply the color to the marker's visual.
   */
  public get strokeColor() {
    return this._strokeColor;
  }
  public set strokeColor(color: string) {
    this._strokeColor = color;
    this.applyStrokeColor();
  }
  /**
   * Applies the stroke color to the marker's visual.
   *
   * Override this method in a derived class to apply the color to the marker's visual.
   */
  protected applyStrokeColor() {}

  /**
   * Fill color of the marker.
   */
  protected _fillColor = 'transparent';
  /**
   * Fill color of the marker.
   *
   * In a derived class override {@link applyFillColor} to apply the color to the marker's visual.
   */
  public get fillColor() {
    return this._fillColor;
  }
  public set fillColor(color: string) {
    this._fillColor = color;
    this.applyFillColor();
  }
  /**
   * Applies the fill color to the marker's visual.
   *
   * Override this method in a derived class to apply the color to the marker's visual.
   */
  protected applyFillColor() {}

  /**
   * Stroke (outline) width of the marker.
   */
  protected _strokeWidth = 0;
  /**
   * Stroke (outline) width of the marker.
   *
   * In a derived class override {@link applyStrokeWidth} to apply the width to the marker's visual.
   */
  public get strokeWidth() {
    return this._strokeWidth;
  }
  public set strokeWidth(value) {
    this._strokeWidth = value;
    this.applyStrokeWidth();
  }
  /**
   * Applies the stroke width to the marker's visual.
   *
   * Override this method in a derived class to apply the width to the marker's visual.
   */
  protected applyStrokeWidth() {}

  /**
   * Stroke (outline) dash array of the marker.
   */
  protected _strokeDasharray = '';
  /**
   * Stroke (outline) dash array of the marker.
   *
   * In a derived class override {@link applyStrokeDasharray} to apply the dash array to the marker's visual.
   */
  public get strokeDasharray() {
    return this._strokeDasharray;
  }
  public set strokeDasharray(value) {
    this._strokeDasharray = value;
    this.applyStrokeDasharray();
  }
  /**
   * Applies the stroke dash array to the marker's visual.
   *
   * Override this method in a derived class to apply the dash array to the marker's visual.
   */
  protected applyStrokeDasharray() {}

  /**
   * Opacity of the marker.
   */
  protected _opacity = 1;
  /**
   * Opacity of the marker.
   *
   * In a derived class override {@link applyOpacity} to apply the opacity to the marker's visual.
   */
  public get opacity() {
    return this._opacity;
  }
  public set opacity(value) {
    this._opacity = value;
    this.applyOpacity();
  }
  /**
   * Applies the opacity to the marker's visual.
   *
   * Override this method in a derived class to apply the opacity to the marker's visual
   */
  protected applyOpacity() {}

  /**
   * Creates a new marker object.
   *
   * @param container - SVG container object holding the marker's visual.
   */
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
   * @returns true if the element belongs to the marker.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ownsTarget(el: EventTarget): boolean {
    return false;
  }

  /**
   * Disposes the marker and cleans up.
   */
  public dispose(): void {}

  protected addMarkerVisualToContainer(element: SVGElement): void {
    if (this.container.childNodes.length > 0) {
      this.container.insertBefore(element, this.container.childNodes[0]);
    } else {
      this.container.appendChild(element);
    }
  }

  /**
   * When overridden in a derived class, represents a preliminary outline for markers that can be displayed before the marker is actually created.
   * @returns SVG path string.
   */
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
   * Scales marker. Used after resize.
   *
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
