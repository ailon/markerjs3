import { IPoint, MarkerBase, MarkerBaseState, SvgHelper } from '../core';
import { MarkerEditorProperties } from './MarkerEditorProperties';

/**
 * Represents marker's state (status) in time.
 */
export type MarkerEditorState =
  | 'new'
  | 'creating'
  | 'select'
  | 'move'
  | 'resize'
  | 'rotate'
  | 'edit';

export class MarkerBaseEditor<TMarkerType extends MarkerBase = MarkerBase> {
protected _markerType: new (container: SVGGElement) => TMarkerType;

  protected _marker: TMarkerType;

  public get marker(): TMarkerType {
    return this._marker;
  }

  protected _container: SVGGElement;
  /**
   * Returns the SVG container for the marker's and editor's visual elements.
   */
  public get container(): SVGGElement {
    return this._container;
  }

  /**
   * Overlay container for HTML elements like text editors, etc.
   */
  protected _overlayContainer: HTMLDivElement;
  /**
   * Overlay container for HTML elements like text editors, etc.
   */
  public get overlayContainer(): HTMLDivElement {
    return this._overlayContainer;
  }

  /**
   * Editor's state.
   */
  protected _state: MarkerEditorState = 'new';
  /**
   * Gets editor's state.
   */
  public get state(): MarkerEditorState {
    return this._state;
  }
  /**
   * Sets editor's state.
   */
  public set state(value: MarkerEditorState) {
    this._state = value;
  }

  /**
   * SVG group holding editor's control box.
   */
  protected _controlBox = SvgHelper.createGroup();

  /**
   * Method called when marker creation is finished.
   */
  public onMarkerCreated?: <T extends MarkerBase = TMarkerType>(marker: T) => void;

  /**
   * Method to call when marker state changes.
   */
  public onStateChanged?: <T extends MarkerBase = TMarkerType>(marker: T) => void;

  /**
   * Marker's state when it is selected
   */
  protected manipulationStartState?: MarkerBaseState;

  /**
   * Is this marker selected?
   */
  protected _isSelected = false;

  /**
   * Returns true if the marker is currently selected
   */
  public get isSelected(): boolean {
    return this._isSelected;
  }

  constructor(properties: MarkerEditorProperties<TMarkerType>) {
    this._container = properties.container;
    this._overlayContainer = properties.overlayContainer;
    this._markerType = properties.markerType;
    this._marker =
      properties.marker ?? new properties.markerType(properties.container);

    this.select = this.select.bind(this);
    this.deselect = this.deselect.bind(this);
    this.ownsTarget = this.ownsTarget.bind(this);
    this.adjustControlBox = this.adjustControlBox.bind(this);
    this.stateChanged = this.stateChanged.bind(this);
    this.scale = this.scale.bind(this);
    this.dispose = this.dispose.bind(this);
    this.pointerDown = this.pointerDown.bind(this);
    this.pointerUp = this.pointerUp.bind(this);
    this.manipulate = this.manipulate.bind(this);
    this.dblClick = this.dblClick.bind(this);
  }

  public ownsTarget(el: EventTarget | null): boolean {
    let found = false;
    if (el !== null) {
      if (this._marker?.ownsTarget(el)) {
        found = true;
      }
    }
    return found;
  }

  /**
   * Selects this marker and displays appropriate selected marker UI.
   */
  public select(): void {
    this.container.style.cursor = 'move';
    this._isSelected = true;
    this.manipulationStartState = this._marker.getState();
  }

  /**
   * Deselects this marker and hides selected marker UI.
   */
  public deselect(): void {
    this.container.style.cursor = 'default';
    this._isSelected = false;
    this.stateChanged();
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) down event.
   *
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public pointerDown(point: IPoint, target?: EventTarget): void {}

  /**
   * Handles pointer (mouse, touch, stylus, etc.) double click event.
   *
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public dblClick(point: IPoint, target?: EventTarget): void {}

  /**
   * Handles marker manipulation (move, resize, rotate, etc.).
   *
   * @param point - event coordinates.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public manipulate(point: IPoint): void {}

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   *
   * @param point - event coordinates.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public pointerUp(point: IPoint): void {
    this.stateChanged();
  }

  /**
   * Disposes the marker and clean's up.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public dispose(): void {}

  protected adjustControlBox() {}

  public scale(scaleX: number, scaleY: number): void {
    this._marker.scale(scaleX, scaleY);

    this.adjustControlBox();
  }

  /**
   * Called by a marker when its state could have changed.
   * Does a check if the state has indeed changed before firing the handler.
   */
  protected stateChanged(): void {
    if (
      this.onStateChanged &&
      this.state !== 'creating' &&
      this.state !== 'new'
    ) {
      const currentState = this._marker.getState();
      // @todo - check if this is needed
      // avoid reacting to state (mode) differences
      // if (this.manipulationStartState !== undefined) {
      //   this.manipulationStartState.state = 'select';
      // }
      // currentState.state = 'select';
      if (
        JSON.stringify(this.manipulationStartState) !=
        JSON.stringify(currentState)
      ) {
        this.onStateChanged(this.marker);
      }
    }
  }
}
