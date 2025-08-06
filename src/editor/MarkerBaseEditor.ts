import { IPoint, MarkerBase, MarkerBaseState } from '../core';
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

/**
 * Marker creation style defines whether markers are created by drawing them or just dropping them on the canvas.
 */
export type MarkerCreationStyle = 'draw' | 'drop';

/**
 * Base class for all marker editors.
 *
 * @typeParam TMarkerType - marker type the instance of the editor is for.
 *
 * @summary Base class for all marker editors.
 * @group Editors
 */
export class MarkerBaseEditor<TMarkerType extends MarkerBase = MarkerBase> {
  /**
   * Marker type constructor.
   */
  protected _markerType: new (container: SVGGElement) => TMarkerType;

  /**
   * Marker creation style.
   *
   * Markers can either be created by drawing them or just dropping them on the canvas.
   */
  protected _creationStyle: MarkerCreationStyle = 'draw';
  /**
   * Marker creation style.
   *
   * Markers can either be created by drawing them or just dropping them on the canvas.
   */
  public get creationStyle(): MarkerCreationStyle {
    return this._creationStyle;
  }

  /**
   * Type guard for specific marker editor types.
   *
   * This allows to check if the editor is of a specific type which is useful for displaying type-specific UI.
   *
   * @typeParam T - specific marker editor type.
   * @param cls
   * @returns
   */
  public is<T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cls: new (...args: any[]) => T,
  ): this is T {
    return this instanceof cls;
  }

  /**
   * Marker instance.
   */
  protected _marker: TMarkerType;

  /**
   * Returns the marker instance.
   */
  public get marker(): TMarkerType {
    return this._marker;
  }

  /**
   * SVG container for the marker's and editor's visual elements.
   */
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
  protected _controlBox?: SVGGElement;

  /**
   * Method called when marker creation is finished.
   */
  public onMarkerCreated?: <T extends MarkerBaseEditor<MarkerBase>>(
    editor: T,
  ) => void;

  /**
   * Method to call when marker state changes.
   */
  public onStateChanged?: <T extends MarkerBaseEditor<MarkerBase>>(
    editor: T,
  ) => void;

  /**
   * Marker's state when it is selected
   */
  protected manipulationStartState?: string;

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

  /**
   * When set to true, a new marker of the same type is created immediately after the current one is finished.
   */
  protected _continuousCreation = false;
  /**
   * When set to true, a new marker of the same type is created immediately after the current one is finished.
   */
  public get continuousCreation() {
    return this._continuousCreation;
  }

  /**
   * Sets marker's stroke (outline) color.
   * @param color - color as string
   */
  public set strokeColor(color: string) {
    this.marker.strokeColor = color;
  }

  /**
   * Gets marker's stroke (outline) color.
   */
  public get strokeColor(): string {
    return this.marker.strokeColor;
  }

  /**
   * Sets marker's stroke (outline) width.
   * @param width - stroke width in pixels.
   */
  public set strokeWidth(width: number) {
    this.marker.strokeWidth = width;
    this.adjustControlBox();
    this.stateChanged();
  }

  /**
   * Gets marker's stroke (outline) width.
   */
  public get strokeWidth(): number {
    return this.marker.strokeWidth;
  }

  /**
   * Sets marker's stroke (outline) dash array.
   * @param dashes - dash array as string
   */
  public set strokeDasharray(dashes: string) {
    this.marker.strokeDasharray = dashes;
    this.stateChanged();
  }

  /**
   * Gets marker's stroke (outline) dash array.
   */
  public get strokeDasharray(): string {
    return this.marker.strokeDasharray;
  }

  /**
   * Sets marker's fill color.
   */
  public set fillColor(color: string) {
    this.marker.fillColor = color;
  }

  /**
   * Gets marker's fill color.
   */
  public get fillColor(): string {
    return this.marker.fillColor;
  }

  /**
   * Sets marker's opacity.
   */
  public set opacity(value: number) {
    this.marker.opacity = value;
  }

  /**
   * Gets marker's opacity.
   */
  public get opacity(): number {
    return this.marker.opacity;
  }

  /**
   * Sets marker's notes.
   */
  public set notes(value: string | undefined) {
    this.marker.notes = value;
  }

  /**
   * Gets marker's notes.
   */
  public get notes(): string | undefined {
    return this.marker.notes;
  }

  private _zoomLevel = 1;

  /**
   * Returns the current zoom level.
   *
   * @remarks
   * This set by the MarkerArea based on its current zoom level.
   * It is used to scale the marker editor controls.
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
   * It is used to scale the marker editor controls.
   *
   * @since 3.6.0
   */
  public set zoomLevel(value: number) {
    this._zoomLevel = value;
    this.adjustControlBox();
  }

  /**
   * Creates a new instance of marker editor.
   *
   * @param properties - marker editor properties.
   */
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

  /**
   * Returns true if the marker or the editor owns supplied target element.
   *
   * @param el target element
   * @returns
   */
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
   * Is this marker selected in a multi-selection?
   */
  protected isMultiSelected = false;
  /**
   * Selects this marker and displays appropriate selected marker UI.
   */
  public select(multi = false): void {
    this.isMultiSelected = multi;
    this.container.style.cursor = 'move';
    this._isSelected = true;
    this.manipulationStartState = JSON.stringify(this._marker.getState());
    //console.log('manipulationStartState', this.manipulationStartState);
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
   * @param ev - pointer event.
   */
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public pointerDown(point: IPoint, target?: EventTarget, ev?: PointerEvent): void {}

  /**
   * Handles pointer (mouse, touch, stylus, etc.) double click event.
   *
   * @param point - event coordinates.
   * @param target - direct event target element.
   * @param ev - pointer event.
   */
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public dblClick(point: IPoint, target?: EventTarget, ev?: MouseEvent): void {}

  /**
   * Handles marker manipulation (move, resize, rotate, etc.).
   *
   * @param point - event coordinates.
   * @param ev - pointer event.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public manipulate(point: IPoint, ev?: PointerEvent): void {}

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   *
   * @param point - event coordinates.
   * @param ev - pointer event.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public pointerUp(point: IPoint, ev?: PointerEvent): void {}

  /**
   * Disposes the marker and clean's up.
   */
  public dispose(): void {}

  /**
   * Adjusts marker's control box.
   */
  protected adjustControlBox() {}

  /**
   * Scales the marker and the editor.
   *
   * @param scaleX
   * @param scaleY
   */
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
      const currentState = JSON.stringify(this._marker.getState());
      // console.log('currentState', currentState);
      // @todo - check if this is needed
      // avoid reacting to state (mode) differences
      // if (this.manipulationStartState !== undefined) {
      //   this.manipulationStartState.state = 'select';
      // }
      // currentState.state = 'select';
      if (this.manipulationStartState != currentState) {
        this.manipulationStartState = currentState;
        this.onStateChanged(this);
      }
    }
  }

  /**
   * Hides all marker's visuals and editor controls.
   *
   * @remarks
   * This could be useful when you want to temporarily hide the marker so you can,
   * for example, create a new one in the same place. Reveal it later with {@link show}.
   *
   * @since 3.7.0
   */
  public hide(): void {
    this.container.style.display = 'none';
  }

  /**
   * Shows all marker's visuals and editor controls.
   *
   * @remarks
   * This could be useful when you want to temporarily hide the marker (with {@link hide}) so you can,
   * for example, create a new one in the same place.
   *
   * @since 3.7.0
   */
  public show(): void {
    this.container.style.display = 'block';
  }

  /**
   * Returns marker's state that can be restored in the future.
   *
   * @returns
   */
  public getState(): MarkerBaseState {
    return this.marker.getState();
  }

  /**
   * Restores previously saved marker state.
   *
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    this._state = 'select';
    this.marker.restoreState(state);
    this.adjustControlBox();
  }
}
