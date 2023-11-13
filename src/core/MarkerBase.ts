import { MarkerBaseState, MarkerState } from './MarkerBaseState';

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

  protected _state: MarkerState = 'new';
  /**
   * Current marker state.
   *
   * Both MarkerArea and the marker itself can react differently to different events based on what state the marker is in.
   */
  public get state(): MarkerState {
    return this._state;
  }

  /**
   * Additional information about the marker
   */
  public notes?: string;

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title: string;

  constructor(container: SVGGElement) {
    this._container = container;
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

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): MarkerBaseState {
    return {
      typeName: MarkerBase.typeName,
      state: this.state,
      notes: this.notes,
    };
  }

  /**
   * Restores previously saved marker state.
   *
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    this._state = state.state;
    this.notes = state.notes;
  }

  /**
   * Scales marker. Used after the image resize.
   *
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public scale(scaleX: number, scaleY: number): void {}
}
