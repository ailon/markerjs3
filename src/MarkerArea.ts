import {
  AnnotationState,
  CalloutMarker,
  CaptionFrameMarker,
  CheckImageMarker,
  CoverMarker,
  CurveMarker,
  CustomImageMarker,
  EllipseFrameMarker,
  EllipseMarker,
  FrameMarker,
  FreehandMarker,
  HighlighterMarker,
  HighlightMarker,
  IPoint,
  LineMarker,
  MarkerBase,
  PolygonMarker,
  TextMarker,
  XImageMarker,
  SvgFilters,
} from './core';
import { SvgHelper } from './core/SvgHelper';
import { PolygonMarkerEditor } from './editor/PolygonMarkerEditor';
import { LinearMarkerEditor } from './editor/LinearMarkerEditor';
import { MarkerBaseEditor } from './editor/MarkerBaseEditor';
import { ShapeOutlineMarkerEditor } from './editor/ShapeOutlineMarkerEditor';
import { UndoRedoManager } from './editor/UndoRedoManager';
import { FreehandMarkerEditor } from './editor/FreehandMarkerEditor';
import { TextMarkerEditor } from './editor/TextMarkerEditor';
import { Activator } from './core/Activator';

import Logo from './assets/markerjs-logo-m.svg';
import { ShapeMarkerEditor } from './editor/ShapeMarkerEditor';
import { ArrowMarker } from './core/ArrowMarker';
import { ArrowMarkerEditor } from './editor/ArrowMarkerEditor';
import { MeasurementMarker } from './core/MeasurementMarker';
import { CalloutMarkerEditor } from './editor/CalloutMarkerEditor';
import { ImageMarkerEditor } from './editor/ImageMarkerEditor';
import { CaptionFrameMarkerEditor } from './editor/CaptionFrameMarkerEditor';
import { CurveMarkerEditor } from './editor/CurveMarkerEditor';

/**
 * Marker area custom event types.
 */
export interface MarkerAreaEventMap {
  /**
   * Marker area initialized.
   */
  areainit: CustomEvent<MarkerAreaEventData>;
  /**
   * Marker area shown.
   */
  areashow: CustomEvent<MarkerAreaEventData>;
  /**
   * Marker area state restored.
   */
  arearestorestate: CustomEvent<MarkerAreaEventData>;
  /**
   * Marker area focused.
   */
  areafocus: CustomEvent<MarkerAreaEventData>;
  /**
   * Marker area lost focus.
   */
  areablur: CustomEvent<MarkerAreaEventData>;
  /**
   * Marker area state changed.
   */
  areastatechange: CustomEvent<MarkerAreaEventData>;

  /**
   * Marker selected.
   */
  markerselect: CustomEvent<MarkerEditorEventData>;
  /**
   * Marker deselected.
   */
  markerdeselect: CustomEvent<MarkerEditorEventData>;
  /**
   * Marker creating.
   */
  markercreating: CustomEvent<MarkerEditorEventData>;
  /**
   * Marker created.
   */
  markercreate: CustomEvent<MarkerEditorEventData>;
  /**
   * Marker about to be deleted.
   */
  markerbeforedelete: CustomEvent<MarkerEditorEventData>;
  /**
   * Marker deleted.
   */
  markerdelete: CustomEvent<MarkerEditorEventData>;
  /**
   * Marker changed.
   */
  markerchange: CustomEvent<MarkerEditorEventData>;
}

/**
 * Marker area custom event data.
 */
export interface MarkerAreaEventData {
  /**
   * {@link MarkerArea} instance.
   */
  markerArea: MarkerArea;
}

/**
 * Marker editor custom event data.
 */
export interface MarkerEditorEventData extends MarkerAreaEventData {
  markerEditor: MarkerBaseEditor;
}

/**
 * @ignore
 */
export type MarkerAreaMode = 'select' | 'create' | 'delete';

/**
 * Marker area web component is the main annotation editor component.
 *
 * @summary
 * The main annotation editor component.
 *
 * @group Components
 *
 * @example
 *
 * Import `MarkerArea` from `@markerjs/markerjs3`:
 *
 * ```js
 * import { MarkerArea } from '@markerjs/markerjs3';
 * ```
 *
 * In the code below we assume that you have an `HTMLImageElement` as `targetImage`. It can be a reference to an image you already have on the page or you can simply create it with something like this:
 *
 * ```js
 * const targetImg = document.createElement('img');
 * targetImg.src = './sample.jpg';
 * ```
 *
 * Now you just need to create an instance of `MarkerArea`, set its `targetImage` property and add it to the page:
 *
 * ```js
 * const markerArea = new MarkerArea();
 * markerArea.targetImage = targetImg;
 * editorContainerDiv.appendChild(markerArea);
 * ```
 *
 * To initiate creation of a marker you just call `createMarker()` and pass it the name (or type) of the marker you want to create. So, if you have a button with id `addFrameButton` you can make it create a new `FrameMarker` with something like this:
 *
 * ```js
 * document.querySelector("#addButton")!.addEventListener("click", () => {
 *   markerArea.createMarker("FrameMarker");
 * });
 * ```
 *
 * And whenever you want to save state (current annotation) you just call `getState()`:
 *
 * ```js
 * document.querySelector("#saveStateButton")!.addEventListener("click", () => {
 *   const state = markerArea.getState();
 *   console.log(state);
 * });
 * ```
 */
export class MarkerArea extends HTMLElement {
  private _contentContainer?: HTMLDivElement;
  private _canvasContainer?: HTMLDivElement;

  private _overlayContainer!: HTMLDivElement;
  private _overlayContentContainer!: HTMLDivElement;

  private _mainCanvas?: SVGSVGElement;
  private _groupLayer?: SVGGElement;

  private _editingTarget?: HTMLImageElement;

  private width = 0;
  private height = 0;

  private _targetWidth = -1;
  /**
   * Returns the target image width.
   */
  public get targetWidth() {
    return this._targetWidth;
  }
  /**
   * Sets the target image width.
   */
  public set targetWidth(value) {
    this._targetWidth = value;
    this.setMainCanvasSize();
  }
  private _targetHeight = -1;
  /**
   * Returns the target image height.
   */
  public get targetHeight() {
    return this._targetHeight;
  }
  /**
   * Sets the target image height.
   */
  public set targetHeight(value) {
    this._targetHeight = value;
    this.setMainCanvasSize();
  }

  private mode: MarkerAreaMode = 'select';

  private _logoUI?: HTMLElement;

  private _isInitialized = false;

  private _currentMarkerEditor?: MarkerBaseEditor;
  /**
   * Returns the currently active marker editor.
   */
  public get currentMarkerEditor(): MarkerBaseEditor | undefined {
    return this._currentMarkerEditor;
  }
  private _selectedMarkerEditors: MarkerBaseEditor[] = [];
  /**
   * Returns the currently selected marker editors.
   */
  public get selectedMarkerEditors(): MarkerBaseEditor[] {
    return this._selectedMarkerEditors;
  }

  private _newMarkerOutline: SVGPathElement = SvgHelper.createPath('', [
    ['stroke', '#333'],
    ['stroke-width', '0.5'],
    ['stroke-dasharray', '2 5'],
    ['fill', 'rgba(200,200,200,0.5)'],
    ['pointer-events', 'none'],
  ]);

  private _targetImageLoaded = false;
  private _targetImage: HTMLImageElement | undefined;
  /**
   * Returns the target image.
   */
  public get targetImage(): HTMLImageElement | undefined {
    return this._targetImage;
  }
  /**
   * Sets the target image.
   */
  public set targetImage(value: HTMLImageElement | undefined) {
    this._targetImage = value;
    this._targetImageLoaded = false;
    if (value !== undefined) {
      this.addTargetImage();
    }
  }

  /**
   * The collection of available marker editor types.
   */
  public markerEditors: Map<
    typeof MarkerBase,
    typeof MarkerBaseEditor<MarkerBase>
  > = new Map();

  /**
   * The collection of marker editors in the annotation.
   */
  public editors: MarkerBaseEditor[] = [];

  private _zoomLevel = 1;
  /**
   * Returns the current zoom level.
   */
  public get zoomLevel(): number {
    return this._zoomLevel;
  }
  /**
   * Sets the current zoom level.
   */
  public set zoomLevel(value: number) {
    this._zoomLevel = value;
    if (
      this._canvasContainer &&
      this._contentContainer &&
      this._mainCanvas &&
      this._overlayContainer
    ) {
      // this.setMainCanvasSize();
      this._mainCanvas.style.transform = `scale(${this._zoomLevel})`;
      this.setEditingTargetSize();

      const scrollMultiplier = Math.max(this._zoomLevel, 1);
      this._canvasContainer.scrollTo({
        left:
          (this._mainCanvas.clientWidth * scrollMultiplier -
            this._canvasContainer.clientWidth) /
          2,
        top:
          (this._mainCanvas.clientHeight * scrollMultiplier -
            this._canvasContainer.clientHeight) /
          2,
      });

      this._overlayContainer.style.transform = `scale(${this._zoomLevel})`;
    }
  }

  private prevPanPoint: IPoint = { x: 0, y: 0 };
  private panTo(point: IPoint) {
    this._canvasContainer?.scrollBy({
      left: this.prevPanPoint.x - point.x,
      top: this.prevPanPoint.y - point.y,
    });
    this.prevPanPoint = point;
  }

  private undoRedoManager = new UndoRedoManager<AnnotationState>();

  private _defaultFilter?: string;
  /**
   * Returns the default SVG filter for the created markers.
   *
   * @since 3.2.0
   */
  public get defaultFilter(): string | undefined {
    return this._defaultFilter;
  }
  /**
   * Sets the default SVG filter for the created markers.
   *
   * @remarks
   * The filter should be a valid SVG filter string.
   *
   * In Chromium-based browsers and Firefox, you can use CSS filter strings
   *  e.g. "drop-shadow(2px 2px 2px black)". Unfortunately, at the time of
   * the implementation this doesn't work in Safari (meaning any browser on iOS as well).
   *
   * For cross-browser compatibility, version 3.3 introduces a set of default filters.
   * These are dropShadow, outline, and glow. You can use them by setting the defaultFilter
   * to "url(#dropShadow)", "url(#outline)", or "url(#glow)" respectively.
   *
   * @since 3.2.0
   */
  public set defaultFilter(value: string | undefined) {
    this._defaultFilter = value;
  }

  private _defsElement?: SVGDefsElement;
  private _defs: (string | Node)[] = [];

  constructor() {
    super();

    this.markerEditors.set(FrameMarker, ShapeOutlineMarkerEditor<FrameMarker>);
    this.markerEditors.set(
      EllipseFrameMarker,
      ShapeOutlineMarkerEditor<FrameMarker>,
    );
    this.markerEditors.set(LineMarker, LinearMarkerEditor<LineMarker>);
    this.markerEditors.set(PolygonMarker, PolygonMarkerEditor<PolygonMarker>);
    this.markerEditors.set(
      FreehandMarker,
      FreehandMarkerEditor<FreehandMarker>,
    );
    this.markerEditors.set(TextMarker, TextMarkerEditor<TextMarker>);
    this.markerEditors.set(CoverMarker, ShapeMarkerEditor<CoverMarker>);
    this.markerEditors.set(HighlightMarker, ShapeMarkerEditor<HighlightMarker>);
    this.markerEditors.set(EllipseMarker, ShapeMarkerEditor<EllipseMarker>);
    this.markerEditors.set(ArrowMarker, ArrowMarkerEditor<ArrowMarker>);
    this.markerEditors.set(
      MeasurementMarker,
      LinearMarkerEditor<MeasurementMarker>,
    );
    this.markerEditors.set(CalloutMarker, CalloutMarkerEditor<CalloutMarker>);
    this.markerEditors.set(
      CustomImageMarker,
      ImageMarkerEditor<CustomImageMarker>,
    );
    this.markerEditors.set(
      CheckImageMarker,
      ImageMarkerEditor<CheckImageMarker>,
    );
    this.markerEditors.set(XImageMarker, ImageMarkerEditor<CheckImageMarker>);
    this.markerEditors.set(
      CaptionFrameMarker,
      CaptionFrameMarkerEditor<CaptionFrameMarker>,
    );
    this.markerEditors.set(CurveMarker, CurveMarkerEditor<CurveMarker>);
    this.markerEditors.set(
      HighlighterMarker,
      FreehandMarkerEditor<HighlighterMarker>,
    );

    this.connectedCallback = this.connectedCallback.bind(this);
    this.disconnectedCallback = this.disconnectedCallback.bind(this);

    this.createLayout = this.createLayout.bind(this);
    this.addMainCanvas = this.addMainCanvas.bind(this);
    this.setMainCanvasSize = this.setMainCanvasSize.bind(this);
    this.setEditingTargetSize = this.setEditingTargetSize.bind(this);
    this.initOverlay = this.initOverlay.bind(this);
    this.addTargetImage = this.addTargetImage.bind(this);

    this.attachEvents = this.attachEvents.bind(this);
    this.attachWindowEvents = this.attachWindowEvents.bind(this);
    this.detachEvents = this.detachEvents.bind(this);
    this.detachWindowEvents = this.detachWindowEvents.bind(this);

    this.onCanvasPointerDown = this.onCanvasPointerDown.bind(this);
    this.onCanvasDblClick = this.onCanvasDblClick.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerOut = this.onPointerOut.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    this.createMarker = this.createMarker.bind(this);
    this.addNewMarker = this.addNewMarker.bind(this);
    this.markerCreated = this.markerCreated.bind(this);
    this.markerStateChanged = this.markerStateChanged.bind(this);
    this.deleteMarker = this.deleteMarker.bind(this);
    this.deleteSelectedMarkers = this.deleteSelectedMarkers.bind(this);

    this.switchToSelectMode = this.switchToSelectMode.bind(this);

    this.showOutline = this.showOutline.bind(this);
    this.hideOutline = this.hideOutline.bind(this);

    this.getState = this.getState.bind(this);
    this.restoreState = this.restoreState.bind(this);

    this.undo = this.undo.bind(this);
    this.addUndoStep = this.addUndoStep.bind(this);
    this.undoStep = this.undoStep.bind(this);
    this.redo = this.redo.bind(this);
    this.redoStep = this.redoStep.bind(this);

    this.toggleLogo = this.toggleLogo.bind(this);
    this.addLogo = this.addLogo.bind(this);
    this.removeLogo = this.removeLogo.bind(this);

    this.adjustMarqueeSelectOutline =
      this.adjustMarqueeSelectOutline.bind(this);
    this.hideMarqueeSelectOutline = this.hideMarqueeSelectOutline.bind(this);

    this.addDefs = this.addDefs.bind(this);
    this.addDefaultFilterDefs = this.addDefaultFilterDefs.bind(this);

    this.attachShadow({ mode: 'open' });
  }

  private connectedCallback() {
    this.dispatchEvent(
      new CustomEvent<MarkerAreaEventData>('areainit', {
        detail: { markerArea: this },
      }),
    );
    Activator.addKeyAddListener(this.toggleLogo);
    this.createLayout();
    this.addMainCanvas();
    this.initOverlay();
    this.attachEvents();
    this._isInitialized = true;
    if (this.targetImage !== undefined) {
      this.addTargetImage();
    }
    this.setMainCanvasSize();
    this.addDefaultFilterDefs();
    this.toggleLogo();
    this.dispatchEvent(
      new CustomEvent<MarkerAreaEventData>('areashow', {
        detail: { markerArea: this },
      }),
    );
  }

  private disconnectedCallback() {
    this.detachEvents();
  }

  private createLayout() {
    this.style.display = 'flex';
    this.style.width = this.style.width !== '' ? this.style.width : '100%';
    this.style.height = this.style.height !== '' ? this.style.height : '100%';
    this.style.position = 'relative';

    this._contentContainer = document.createElement('div');
    this._contentContainer.style.display = 'flex';
    this._contentContainer.style.position = 'relative';
    this._contentContainer.style.flexGrow = '2';
    this._contentContainer.style.flexShrink = '1';
    this._contentContainer.style.overflow = 'hidden';

    this._canvasContainer = document.createElement('div');
    this._canvasContainer.style.touchAction = 'pinch-zoom';
    this._canvasContainer.className = 'canvas-container';
    this._canvasContainer.style.display = 'grid';
    this._canvasContainer.style.gridTemplateColumns = '1fr';
    this._canvasContainer.style.flexGrow = '2';
    this._canvasContainer.style.flexShrink = '2';
    this._canvasContainer.style.justifyItems = 'center';
    this._canvasContainer.style.alignItems = 'center';
    this._canvasContainer.style.overflow = 'auto';
    this._canvasContainer.style.userSelect = 'none';

    this._contentContainer.appendChild(this._canvasContainer);

    this.shadowRoot?.appendChild(this._contentContainer);
  }

  private addMainCanvas() {
    this.width = this._contentContainer?.clientWidth || 0;
    this.height = this._contentContainer?.clientHeight || 0;

    this._mainCanvas = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    this._mainCanvas.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.setMainCanvasSize();
    this._mainCanvas.style.gridColumnStart = '1';
    this._mainCanvas.style.gridRowStart = '1';
    this._mainCanvas.style.pointerEvents = 'auto';
    // this._mainCanvas.style.backgroundColor = 'pink'; // @todo
    // this._mainCanvas.style.opacity = '0.3'; // @todo
    this._mainCanvas.style.margin = '10px';
    this._mainCanvas.style.transform = `scale(${this._zoomLevel})`;

    this.addDefsToMainCanvas();

    this._groupLayer = SvgHelper.createGroup();

    this._mainCanvas.appendChild(this._groupLayer);

    this._canvasContainer?.appendChild(this._mainCanvas);
  }

  private addDefsToMainCanvas() {
    this._defsElement = SvgHelper.createDefs();
    this._mainCanvas?.appendChild(this._defsElement);
    this._defsElement.append(...this._defs);
  }

  private setMainCanvasSize() {
    if (
      this._mainCanvas !== undefined &&
      this._targetHeight > 0 &&
      this._targetWidth > 0
    ) {
      this._mainCanvas.style.width = `${this._targetWidth * this.zoomLevel}px`;
      this._mainCanvas.style.height = `${
        this._targetHeight * this.zoomLevel
      }px`;
      this._mainCanvas.setAttribute(
        'width',
        `${this._targetWidth * this.zoomLevel}`,
      );
      this._mainCanvas.setAttribute(
        'height',
        `${this._targetHeight * this.zoomLevel}`,
      );
      this._mainCanvas.setAttribute(
        'viewBox',
        '0 0 ' +
          this._targetWidth.toString() +
          ' ' +
          this._targetHeight.toString(),
      );
      this.setEditingTargetSize();
    }
  }

  private setEditingTargetSize() {
    if (this._editingTarget !== undefined) {
      this._editingTarget.width = this._targetWidth * this.zoomLevel;
      this._editingTarget.height = this._targetHeight * this.zoomLevel;
      this._editingTarget.style.width = `${
        this._targetWidth * this.zoomLevel
      }px`;
      this._editingTarget.style.height = `${
        this._targetHeight * this.zoomLevel
      }px`;
    }
  }

  private initOverlay(): void {
    this._overlayContainer = document.createElement('div');
    this._overlayContainer.style.pointerEvents = 'none';
    this._overlayContainer.style.display = 'flex';
    this._overlayContainer.style.alignItems = 'center';
    this._overlayContainer.style.justifyContent = 'center';
    this._overlayContainer.style.gridRowStart = '1';
    this._overlayContainer.style.gridColumnStart = '1';

    this._canvasContainer?.appendChild(this._overlayContainer);

    this._overlayContentContainer = document.createElement('div');
    this._overlayContentContainer.style.position = 'relative';
    // @todo
    // this._overlayContentContainer.style.width = `${this.documentWidth}px`;
    // this._overlayContentContainer.style.height = `${this.documentHeight}px`;
    this._overlayContentContainer.style.display = 'flex';
    this._overlayContainer.appendChild(this._overlayContentContainer);
  }

  private addTargetImage() {
    if (
      this._isInitialized &&
      this._editingTarget === undefined &&
      this.targetImage !== undefined &&
      this._canvasContainer !== undefined &&
      this._mainCanvas !== undefined
    ) {
      this._editingTarget = document.createElement('img');

      this._targetWidth =
        this._targetWidth > 0
          ? this._targetWidth
          : this.targetImage.clientWidth;
      this._targetHeight =
        this._targetHeight > 0
          ? this._targetHeight
          : this.targetImage.clientHeight;

      this._editingTarget.addEventListener('load', (ev) => {
        if (this._editingTarget !== undefined) {
          if (this._targetHeight <= 0 || this._targetWidth <= 0) {
            const img = <HTMLImageElement>ev.target;

            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const calculatedWidth =
              this._targetWidth > 0
                ? this._targetWidth
                : this._targetHeight > 0
                ? this._targetHeight * aspectRatio
                : img.clientWidth > 0
                ? img.clientWidth
                : img.naturalWidth;
            const calculatedHeight =
              this._targetHeight > 0
                ? this._targetHeight
                : this._targetWidth > 0
                ? this._targetWidth / aspectRatio
                : img.clientHeight > 0
                ? img.clientHeight
                : img.naturalHeight;

            this._targetWidth = calculatedWidth;
            this._targetHeight = calculatedHeight;
          }
          this._editingTarget.width = this._targetWidth;
          this._editingTarget.height = this._targetHeight;
          this._editingTarget.style.width = `${this._targetWidth}px`;
          this._editingTarget.style.height = `${this._targetHeight}px`;
          this._editingTarget.style.gridColumnStart = '1';
          this._editingTarget.style.gridRowStart = '1';

          this.setMainCanvasSize();

          this._targetImageLoaded = true;
          if (this._stateToRestore !== undefined) {
            this.restoreState(this._stateToRestore);
          }
        }

        // reset zoom to scroll to center if needed
        this.zoomLevel = this._zoomLevel;
      });
      this._editingTarget.src = this.targetImage.src;

      this._canvasContainer.insertBefore(this._editingTarget, this._mainCanvas);
    }
  }

  private addDefaultFilterDefs() {
    this.addDefs(...SvgFilters.getDefaultFilterSet());
  }

  /**
   * Registers a marker type and its editor to be available in the marker area.
   * @param markerType
   * @param editorType
   */
  public registerMarkerType(
    markerType: typeof MarkerBase,
    editorType: typeof MarkerBaseEditor<MarkerBase>,
  ) {
    this.markerEditors.set(markerType, editorType);
  }

  /**
   * Creates a new marker of the specified type.
   * @param markerType
   * @returns
   */
  public createMarker(markerType: typeof MarkerBase | string) {
    let mType: typeof MarkerBase = FrameMarker;
    if (typeof markerType === 'string') {
      mType = this.getMarkerTypeByName(markerType) || FrameMarker;
    } else {
      mType = markerType;
    }
    const markerEditor = this.markerEditors.get(mType);
    if (markerEditor && this._mainCanvas) {
      this.setCurrentEditor();
      this.deselectEditor();
      this.addUndoStep();
      this._currentMarkerEditor = this.addNewMarker(markerEditor, mType);
      this._currentMarkerEditor.onMarkerCreated = this.markerCreated;
      this._currentMarkerEditor.onStateChanged = this.markerStateChanged;

      switch (this._currentMarkerEditor.creationStyle) {
        case 'drop':
          this._mainCanvas.style.cursor = 'move';
          break;
        case 'draw':
        default:
          this._mainCanvas.style.cursor = 'crosshair';
          break;
      }

      this.dispatchEvent(
        new CustomEvent<MarkerEditorEventData>('markercreating', {
          detail: {
            markerArea: this,
            markerEditor: this._currentMarkerEditor,
          },
        }),
      );
    }

    return this._currentMarkerEditor;
  }

  private addNewMarker(
    markerEditorType: typeof MarkerBaseEditor<MarkerBase>,
    markerType: typeof MarkerBase,
  ): MarkerBaseEditor {
    if (this._mainCanvas === undefined) {
      throw new Error('Main canvas is not initialized.');
    }

    const g = SvgHelper.createGroup();
    if (this.defaultFilter && markerType.applyDefaultFilter) {
      g.setAttribute('filter', this.defaultFilter);
    }
    this._mainCanvas.appendChild(g);

    return new markerEditorType({
      container: g,
      overlayContainer: this._overlayContentContainer,
      markerType: markerType,
    });
  }

  private markerCreated(editor: MarkerBaseEditor<MarkerBase>) {
    if (this._mainCanvas) {
      this.mode = 'select';
      this._mainCanvas.style.cursor = 'default';
      this.editors.push(editor);
      this.setCurrentEditor(editor);
      if (editor.continuousCreation) {
        const newMarkerEditor = this.createMarker(editor.marker.typeName);
        if (
          editor.is(FreehandMarkerEditor) &&
          newMarkerEditor?.is(FreehandMarkerEditor)
        ) {
          newMarkerEditor.strokeColor = editor.strokeColor;
          newMarkerEditor.strokeWidth = editor.strokeWidth;
          newMarkerEditor.strokeDasharray = editor.strokeDasharray;
        }
      }
      this.addUndoStep();
      this.dispatchEvent(
        new CustomEvent<MarkerEditorEventData>('markercreate', {
          detail: { markerArea: this, markerEditor: editor },
        }),
      );
    }
  }

  private markerStateChanged(markerEditor: MarkerBaseEditor): void {
    this.addUndoStep();
    this.dispatchEvent(
      new CustomEvent<MarkerEditorEventData>('markerchange', {
        detail: { markerArea: this, markerEditor: markerEditor },
      }),
    );
  }

  /**
   * Deletes a marker represented by the specified editor.
   * @param markerEditor
   */
  public deleteMarker(markerEditor: MarkerBaseEditor): void {
    if (this.editors.indexOf(markerEditor) >= 0) {
      this.addUndoStep();
      this.dispatchEvent(
        new CustomEvent<MarkerEditorEventData>('markerbeforedelete', {
          detail: { markerArea: this, markerEditor: markerEditor },
        }),
      );
      this._mainCanvas?.removeChild(markerEditor.container);
      markerEditor.dispose();
      this.editors.splice(this.editors.indexOf(markerEditor), 1);
      this.dispatchEvent(
        new CustomEvent<MarkerEditorEventData>('markerdelete', {
          detail: { markerArea: this, markerEditor: markerEditor },
        }),
      );
    }
  }

  /**
   * Deselects all markers.
   */
  public deleteSelectedMarkers() {
    this._selectedMarkerEditors.forEach((m) => this.deleteMarker(m));
    this._selectedMarkerEditors.splice(0);
    this.hideMarqueeSelectOutline();
  }

  /**
   * Sets the current editor and selects it.
   *
   * If `editor` is not supplied the current editor is unselected.
   *
   * @param editor
   */
  public setCurrentEditor(editor?: MarkerBaseEditor): void {
    if (this._currentMarkerEditor !== editor) {
      // no need to deselect if not changed
      if (this._currentMarkerEditor !== undefined) {
        this.deselectEditor(this._currentMarkerEditor);
      }
    }
    this._currentMarkerEditor = editor;
    if (
      this._currentMarkerEditor !== undefined &&
      !this._currentMarkerEditor.isSelected
    ) {
      if (this._currentMarkerEditor.state !== 'new') {
        this.selectEditor(this._currentMarkerEditor);
        this._currentMarkerEditor.select(false);
      }
    }
  }

  /**
   * Selects the specified editor without setting it as the current editor.
   * @param editor
   */
  public selectEditor(editor: MarkerBaseEditor): void {
    if (this._selectedMarkerEditors.indexOf(editor) < 0) {
      if (this._selectedMarkerEditors.length > 0) {
        this._selectedMarkerEditors[0].select(true);
      }
      this._selectedMarkerEditors.push(editor);
      editor.select(true);

      this.dispatchEvent(
        new CustomEvent<MarkerEditorEventData>('markerselect', {
          detail: { markerArea: this, markerEditor: editor },
        }),
      );
    }
  }

  /**
   * Deselects the specified editor (or all editors if not specified).
   * @param editor
   */
  public deselectEditor(editor?: MarkerBaseEditor): void {
    const selectedCountOnEntry = this._selectedMarkerEditors.length;

    if (selectedCountOnEntry > 0) {
      const eventEditor =
        editor ??
        this._selectedMarkerEditors[this._selectedMarkerEditors.length - 1];

      if (editor === undefined) {
        this._selectedMarkerEditors.forEach((m) => m.deselect());
        this._selectedMarkerEditors.splice(0);
      } else {
        const index = this._selectedMarkerEditors.indexOf(editor);
        if (index >= 0) {
          this._selectedMarkerEditors.splice(index, 1);
          editor.deselect();
        }
      }

      this.dispatchEvent(
        new CustomEvent<MarkerEditorEventData>('markerdeselect', {
          detail: { markerArea: this, markerEditor: eventEditor },
        }),
      );
    }
  }

  private touchPoints = 0;
  private leadPointerId?: number;
  private isDragging = false;
  private isSelecting = false;
  private isPanning = false;

  private _marqueeSelectOutline: SVGRectElement = SvgHelper.createRect(0, 0, [
    ['stroke', 'rgb(35, 35, 255)'],
    ['stroke-width', '1'],
    ['fill', 'rgba(129, 129, 255, 0.3)'],
    ['pointer-events', 'none'],
    ['cursor', 'move'],
  ]);
  private _marqueeSelectRect = new DOMRect(0, 0, 0, 0);

  private _manipulationStartX = 0;
  private _manipulationStartY = 0;

  private onCanvasPointerDown(ev: PointerEvent) {
    // @todo ?
    // if (!this._isFocused) {
    //   this.focus();
    // }

    this._manipulationStartX = ev.clientX;
    this._manipulationStartY = ev.clientY;

    this.touchPoints++;
    if (this.touchPoints === 1) {
      this.leadPointerId = ev.pointerId;
    }

    if (
      (ev.pointerType === 'touch' && this.touchPoints === 1) ||
      (ev.pointerType !== 'touch' && ev.button === 0 && !ev.altKey)
    ) {
      if (
        this._currentMarkerEditor !== undefined &&
        (this._currentMarkerEditor.state === 'new' ||
          this._currentMarkerEditor.state === 'creating')
      ) {
        this.isDragging = true;
        this._currentMarkerEditor.pointerDown(
          SvgHelper.clientToLocalCoordinates(
            this._mainCanvas,
            ev.clientX,
            ev.clientY,
            this.zoomLevel,
          ),
          ev.target ?? undefined,
          ev,
        );
      } else if (this.mode === 'select') {
        const localPoint = SvgHelper.clientToLocalCoordinates(
          this._mainCanvas,
          ev.clientX,
          ev.clientY,
          this.zoomLevel,
        );
        const hitMarker = this.editors.find((m) => m.ownsTarget(ev.target));
        if (hitMarker !== undefined) {
          this.isDragging = true;
          if (ev.shiftKey) {
            this.selectEditor(hitMarker);
            this.initializeMarqueeSelection(localPoint);
          } else if (!hitMarker.isSelected) {
            this.deselectEditor();
            this.setCurrentEditor(hitMarker);
          }
          this._selectedMarkerEditors.forEach((m) =>
            m.pointerDown(localPoint, ev.target ?? undefined, ev),
          );
        } else if (
          ev.target === this._marqueeSelectOutline &&
          this._selectedMarkerEditors.length > 1
        ) {
          this.isDragging = true;
          this._selectedMarkerEditors.forEach((m) =>
            m.pointerDown(localPoint, ev.target ?? undefined, ev),
          );
        } else {
          this.setCurrentEditor();
          this.deselectEditor();
          this.isSelecting = true;
          this.isDragging = true;

          // marquee select
          this.initializeMarqueeSelection(localPoint);

          this.prevPanPoint = { x: ev.clientX, y: ev.clientY };
        }
      }
    } else if (
      (ev.pointerType !== 'touch' &&
        ((ev.button === 0 && ev.altKey) || ev.button === 1)) || // left button + alt or middle button
      (ev.pointerType === 'touch' &&
        this.touchPoints === 2 &&
        ev.pointerId === this.leadPointerId)
    ) {
      this.isDragging = true;
      this.isPanning = true;
      this.prevPanPoint = { x: ev.clientX, y: ev.clientY };

      if (this._mainCanvas) {
        this._mainCanvas.style.cursor = 'grabbing';
      }
    }
  }

  private initializeMarqueeSelection(localPoint: IPoint) {
    this._marqueeSelectRect.x = localPoint.x;
    this._marqueeSelectRect.y = localPoint.y;
    this._marqueeSelectRect.width = 0;
    this._marqueeSelectRect.height = 0;
    SvgHelper.setAttributes(this._marqueeSelectOutline, [
      ['x', localPoint.x.toString()],
      ['y', localPoint.y.toString()],
      ['width', '0'],
      ['height', '0'],
    ]);
    if (
      this._groupLayer &&
      !this._groupLayer.contains(this._marqueeSelectOutline)
    ) {
      this._groupLayer.appendChild(this._marqueeSelectOutline);
    }
  }

  private onCanvasDblClick(ev: MouseEvent) {
    // @todo ?
    // if (!this._isFocused) {
    //   this.focus();
    // }

    if (this.mode === 'select') {
      const hitMarker = this.editors.find((m) => m.ownsTarget(ev.target));
      if (hitMarker !== undefined && hitMarker !== this._currentMarkerEditor) {
        this.setCurrentEditor(hitMarker);
      }
      if (this._currentMarkerEditor !== undefined) {
        this._currentMarkerEditor.dblClick(
          SvgHelper.clientToLocalCoordinates(
            this._mainCanvas,
            ev.clientX,
            ev.clientY,
            this.zoomLevel,
          ),
          ev.target ?? undefined,
          ev,
        );
      } else {
        this.setCurrentEditor();
      }
    }
  }

  private onPointerMove(ev: PointerEvent) {
    if (
      (ev.pointerType === 'touch' && this.touchPoints === 1) ||
      (ev.pointerType !== 'touch' && this.isDragging && !ev.altKey)
    ) {
      const localPoint = SvgHelper.clientToLocalCoordinates(
        this._mainCanvas,
        ev.clientX,
        ev.clientY,
        this.zoomLevel,
      );

      if (
        this._currentMarkerEditor !== undefined ||
        this._selectedMarkerEditors.length > 0
      ) {
        // don't swallow the event when editing text markers
        if (
          this._currentMarkerEditor === undefined ||
          this._currentMarkerEditor.state !== 'edit'
        ) {
          ev.preventDefault();
        }

        if (
          this._currentMarkerEditor !== undefined ||
          this._selectedMarkerEditors.length > 0
        ) {
          this.showOutline(localPoint);

          if (this._selectedMarkerEditors.length > 0) {
            this._selectedMarkerEditors.forEach((m) =>
              m.manipulate(localPoint, ev),
            );
          } else {
            this._currentMarkerEditor?.manipulate(localPoint, ev);
          }
        } else if (this.zoomLevel > 1) {
          this.panTo({ x: ev.clientX, y: ev.clientY });
        }

        this.adjustMarqueeSelectOutline();
      } else if (this.isSelecting) {
        // adjust marquee
        const localManipulationStart = SvgHelper.clientToLocalCoordinates(
          this._mainCanvas,
          this._manipulationStartX,
          this._manipulationStartY,
          this.zoomLevel,
        );

        this._marqueeSelectRect.x = Math.min(
          localPoint.x,
          localManipulationStart.x,
        );
        this._marqueeSelectRect.y = Math.min(
          localPoint.y,
          localManipulationStart.y,
        );
        this._marqueeSelectRect.width =
          Math.abs(ev.clientX - this._manipulationStartX) / this.zoomLevel;
        this._marqueeSelectRect.height =
          Math.abs(ev.clientY - this._manipulationStartY) / this.zoomLevel;

        SvgHelper.setAttributes(this._marqueeSelectOutline, [
          ['x', `${this._marqueeSelectRect.x}`],
          ['y', `${this._marqueeSelectRect.y}`],
          ['width', `${this._marqueeSelectRect.width}`],
          ['height', `${this._marqueeSelectRect.height}`],
        ]);
      }
    } else if (
      (ev.pointerType !== 'touch' && this.isPanning) ||
      (ev.pointerType === 'touch' &&
        this.touchPoints === 2 &&
        ev.pointerId === this.leadPointerId)
    ) {
      this.panTo({ x: ev.clientX, y: ev.clientY });
    }
  }

  private showOutline(localPoint: IPoint) {
    if (
      this._currentMarkerEditor &&
      this._currentMarkerEditor.creationStyle === 'drop' &&
      this._currentMarkerEditor.state === 'new'
    ) {
      if (
        this._mainCanvas !== undefined &&
        !this._mainCanvas.contains(this._newMarkerOutline)
      ) {
        this._mainCanvas.appendChild(this._newMarkerOutline);
      }
      const size = this._currentMarkerEditor.marker.defaultSize;
      SvgHelper.setAttributes(this._newMarkerOutline, [
        ['d', this._currentMarkerEditor.marker.getOutline()],
      ]);
      this._newMarkerOutline.style.transform = `translate(${
        localPoint.x - size.width / 2
      }px, ${localPoint.y - size.height / 2}px)`;
    }
  }

  private hideOutline() {
    if (this._mainCanvas?.contains(this._newMarkerOutline)) {
      this._mainCanvas.removeChild(this._newMarkerOutline);
    }
  }

  private onPointerUp(ev: PointerEvent) {
    if (this.touchPoints > 0) {
      this.touchPoints--;
      if (this.touchPoints === 0) {
        this.leadPointerId = undefined;
      }
    }
    if (this.touchPoints === 0) {
      if (
        this.isDragging &&
        (this._currentMarkerEditor !== undefined ||
          this._selectedMarkerEditors.length > 0)
      ) {
        const localPoint = SvgHelper.clientToLocalCoordinates(
          this._mainCanvas,
          ev.clientX,
          ev.clientY,
          this.zoomLevel,
        );

        if (this._selectedMarkerEditors.length > 1) {
          this._selectedMarkerEditors.forEach((m) =>
            m.pointerUp(localPoint, ev),
          );
          this.adjustMarqueeSelectOutline();
        } else {
          this._currentMarkerEditor?.pointerUp(localPoint, ev);
        }

        this.hideOutline();

        this.addUndoStep();
      } else if (this.isSelecting) {
        // finish marquee selection
        this.finishMarqueeSelection();
        if (this._selectedMarkerEditors.length < 2) {
          this.hideMarqueeSelectOutline();
          if (this._selectedMarkerEditors.length === 1) {
            // revert to single selection
            const onlySelected = this._selectedMarkerEditors[0];
            this.deselectEditor();
            this.setCurrentEditor(onlySelected);
          }
        }
      }
    }
    this.isDragging = false;
    this.isSelecting = false;
    this.isPanning = false;
    if (this._mainCanvas) {
      this._mainCanvas.style.cursor = 'default';
    }
  }

  private finishMarqueeSelection() {
    this.deselectEditor();

    this.editors.forEach((m) => {
      const markerRect = m.marker.getBBox();
      if (
        markerRect.x <
          this._marqueeSelectRect.x + this._marqueeSelectRect.width &&
        markerRect.x + markerRect.width > this._marqueeSelectRect.x &&
        markerRect.y <
          this._marqueeSelectRect.y + this._marqueeSelectRect.height &&
        markerRect.y + markerRect.height > this._marqueeSelectRect.y
      ) {
        this.selectEditor(m);
      }
    });

    this.adjustMarqueeSelectOutline();
  }

  private adjustMarqueeSelectOutline() {
    let x = Number.MAX_VALUE;
    let y = Number.MAX_VALUE;
    let width = 0;
    let height = 0;

    this._selectedMarkerEditors.forEach((m) => {
      const markerRect = m.marker.getBBox();

      x = Math.min(x, markerRect.x);
      y = Math.min(y, markerRect.y);
      width = Math.max(width, markerRect.x + markerRect.width);
      height = Math.max(height, markerRect.y + markerRect.height);
    });

    if (this._selectedMarkerEditors.length > 1) {
      this._marqueeSelectRect.x = x;
      this._marqueeSelectRect.y = y;
      this._marqueeSelectRect.width = width - x;
      this._marqueeSelectRect.height = height - y;

      SvgHelper.setAttributes(this._marqueeSelectOutline, [
        ['x', `${this._marqueeSelectRect.x}`],
        ['y', `${this._marqueeSelectRect.y}`],
        ['width', `${this._marqueeSelectRect.width}`],
        ['height', `${this._marqueeSelectRect.height}`],
        ['pointer-events', ''],
      ]);
    } else {
      this.hideMarqueeSelectOutline();
    }
  }

  private hideMarqueeSelectOutline() {
    if (
      this._groupLayer &&
      this._groupLayer.contains(this._marqueeSelectOutline)
    ) {
      this._groupLayer.removeChild(this._marqueeSelectOutline);
    }
  }

  private onPointerOut(/*ev: PointerEvent*/) {
    if (this.touchPoints > 0) {
      this.touchPoints--;
    }
    this.hideOutline();
  }

  private onKeyUp(ev: KeyboardEvent) {
    if (
      this._currentMarkerEditor !== undefined &&
      (ev.key === 'Delete' || ev.key === 'Backspace')
    ) {
      // @todo
      // this.deleteSelectedMarker();
    }
  }

  private attachEvents() {
    // needed to distinguish when the element is in focus (active)
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    // @todo
    // this.setupResizeObserver();
    this._mainCanvas?.addEventListener('pointerdown', this.onCanvasPointerDown);
    // workaround to prevent a bug with Apple Pencil
    // https://bugs.webkit.org/show_bug.cgi?id=217430
    this._mainCanvas?.addEventListener('touchmove', (ev) =>
      ev.preventDefault(),
    );
    this._mainCanvas?.addEventListener('dblclick', this.onCanvasDblClick);

    this._marqueeSelectOutline.addEventListener('dblclick', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      this.deselectEditor();
      this.hideMarqueeSelectOutline();
    });

    // @todo - using these in Diagrams but not in mjs2 - why?
    // this._mainCanvas?.addEventListener('pointermove', this.onCanvasPointerMove);
    // this._mainCanvas?.addEventListener('pointerup', this.onCanvasPointerUp);
    // this._mainCanvas?.addEventListener('pointerout', this.onCanvasPointerOut);
    this.attachWindowEvents();
  }

  private attachWindowEvents() {
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointerleave', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerOut);
    window.addEventListener('pointerout', this.onPointerOut);
    window.addEventListener('keyup', this.onKeyUp);
  }

  private detachEvents() {
    // @todo
    // if (this._resizeObserver && this._container) {
    //   this._resizeObserver.unobserve(this._container);
    // }

    // this._mainCanvas?.removeEventListener(
    //   'pointerdown',
    //   this.onCanvasPointerDown
    // );
    // this._mainCanvas?.removeEventListener(
    //   'pointerdown',
    //   this.onCanvasPointerUp
    // );
    // this._mainCanvas?.removeEventListener('dblclick', this.onDblClick);
    this.detachWindowEvents();
  }

  private detachWindowEvents() {
    // @todo
    // window.removeEventListener('pointermove', this.onPointerMove);
    // window.removeEventListener('pointerup', this.onPointerUp);
    // window.removeEventListener('pointercancel', this.onPointerOut);
    // window.removeEventListener('pointerout', this.onPointerOut);
    // window.removeEventListener('pointerleave', this.onPointerUp);
    // window.removeEventListener('keyup', this.onKeyUp);
  }

  private getMarkerTypeByName(typeName: string): typeof MarkerBase | undefined {
    let result: typeof MarkerBase | undefined;
    this.markerEditors.forEach((value, key) => {
      if (key.typeName === typeName) {
        result = key;
      }
    });
    return result;
  }

  /**
   * Switches the marker area to select mode and deselects all the selected markers.
   */
  public switchToSelectMode() {
    this.setCurrentEditor();
    if (this._mainCanvas) {
      this._mainCanvas.style.cursor = 'default';
    }
  }

  /**
   * Returns the annotation state.
   * @returns
   */
  public getState(): AnnotationState {
    const result: AnnotationState = {
      version: 3,
      width: this.targetWidth,
      height: this.targetHeight,
      defaultFilter: this.defaultFilter,

      markers: this.editors.map((editor) => {
        return editor.getState();
      }),
    };

    return JSON.parse(JSON.stringify(result));
  }

  private _stateToRestore: AnnotationState | undefined;
  /**
   * Restores the annotation from the previously saved state.
   * @param state
   * @param addUndoStep if true (default) or omitted, an undo step is added after restoring the state
   */
  public restoreState(state: AnnotationState, addUndoStep = true): void {
    // can't restore if image is not loaded yet
    if (!this._targetImageLoaded) {
      this._stateToRestore = state;
      return;
    }
    this._stateToRestore = undefined;

    const stateCopy: AnnotationState = JSON.parse(JSON.stringify(state));
    this.editors.splice(0);

    if (this._mainCanvas && this._groupLayer) {
      // deselect everything
      this.hideMarqueeSelectOutline();
      this.deselectEditor();
      // remove all markers
      while (this._mainCanvas.lastChild) {
        this._mainCanvas.removeChild(this._mainCanvas.lastChild);
      }
      // re-add defs
      this.addDefsToMainCanvas();
      // re-add group layer
      this._mainCanvas.appendChild(this._groupLayer);
    }

    if (this.defaultFilter === undefined && stateCopy.defaultFilter) {
      this.defaultFilter = stateCopy.defaultFilter;
    }

    stateCopy.markers.forEach((markerState) => {
      const markerType = this.getMarkerTypeByName(markerState.typeName);
      if (markerType !== undefined) {
        const editorType = this.markerEditors.get(markerType);
        if (editorType !== undefined) {
          const markerEditor = this.addNewMarker(editorType, markerType);
          markerEditor.restoreState(markerState);
          this.editors.push(markerEditor);
        }
      }
    });

    if (
      stateCopy.width &&
      stateCopy.height &&
      (stateCopy.width !== this.targetWidth ||
        stateCopy.height !== this.targetHeight)
    ) {
      this.scaleMarkers(
        this.targetWidth / stateCopy.width,
        this.targetHeight / stateCopy.height,
      );
    }

    if (addUndoStep) {
      this.addUndoStep();
    }

    this.dispatchEvent(
      new CustomEvent<MarkerAreaEventData>('arearestorestate', {
        detail: { markerArea: this },
      }),
    );
  }

  private scaleMarkers(scaleX: number, scaleY: number) {
    let preScaleSelectedMarker: MarkerBaseEditor | undefined;
    // @todo
    // if (!(this._currentMarker && this._currentMarker instanceof TextMarker)) {
    // can't unselect text marker as it would hide keyboard on mobile
    // eslint-disable-next-line prefer-const
    preScaleSelectedMarker = this._currentMarkerEditor;
    this.setCurrentEditor();
    // } else {
    //   this._currentMarker.scale(scaleX, scaleY);
    // }
    this.editors.forEach((editor) => {
      if (editor !== this._currentMarkerEditor) {
        editor.scale(scaleX, scaleY);
      }
    });
    if (preScaleSelectedMarker !== undefined) {
      this.setCurrentEditor(preScaleSelectedMarker);
    }
  }

  /**
   * NOTE:
   *
   * before removing or modifying this method please consider supporting marker.js
   * by visiting https://markerjs.com/ for details
   *
   * thank you!
   */
  private toggleLogo() {
    if (!Activator.isLicensed('MJS3E') && !Activator.isLicensed('MJS3')) {
      // NOTE:
      // before removing this call please consider supporting marker.js
      // by visiting https://markerjs.com/ for details
      // thank you!
      this.addLogo();
    } else {
      this.removeLogo();
    }
  }

  private addLogo() {
    if (this._logoUI !== undefined) {
      this._contentContainer?.removeChild(this._logoUI);
    }
    this._logoUI = document.createElement('div');
    this._logoUI.style.display = 'inline-block';
    this._logoUI.style.margin = '0px';
    this._logoUI.style.padding = '0px';
    this._logoUI.style.fill = '#333333';
    this._logoUI.style.opacity = '0.5';
    const logoUI = this._logoUI;
    this._logoUI.addEventListener('mouseenter', () => {
      logoUI.style.opacity = '1';
    });
    this._logoUI.addEventListener('mouseleave', () => {
      logoUI.style.opacity = '0.5';
    });

    const link = document.createElement('a');
    link.href = 'https://markerjs.com/';
    link.target = '_blank';
    link.innerHTML = Logo;
    link.title = 'Powered by marker.js';

    link.style.display = 'grid';
    link.style.alignItems = 'center';
    link.style.justifyItems = 'center';
    link.style.padding = '3px';
    link.style.width = '20px';
    link.style.height = '20px';
    link.style.cursor = 'pointer';

    this._logoUI.appendChild(link);

    this._contentContainer?.appendChild(this._logoUI);

    this._logoUI.style.position = 'absolute';
    this._logoUI.style.pointerEvents = 'all';
    this.positionLogo();
  }

  private removeLogo() {
    if (
      this._contentContainer &&
      this._logoUI !== undefined &&
      this._contentContainer.contains(this._logoUI)
    ) {
      this._contentContainer.removeChild(this._logoUI);
    }
  }

  private positionLogo() {
    if (this._logoUI && this._contentContainer) {
      this._logoUI.style.left = `20px`;
      this._logoUI.style.bottom = `20px`;
    }
  }

  /**
   * Returns true if undo operation can be performed (undo stack is not empty).
   */
  public get isUndoPossible(): boolean {
    if (this.undoRedoManager && this.undoRedoManager.isUndoPossible) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns true if redo operation can be performed (redo stack is not empty).
   */
  public get isRedoPossible(): boolean {
    if (this.undoRedoManager && this.undoRedoManager.isRedoPossible) {
      return true;
    } else {
      return false;
    }
  }

  private addUndoStep() {
    if (
      this._currentMarkerEditor === undefined ||
      this._currentMarkerEditor.state !== 'edit'
    ) {
      const currentState = this.getState();
      const lastUndoState = this.undoRedoManager.getLastUndoStep();
      if (
        lastUndoState &&
        (lastUndoState.width !== currentState.width ||
          lastUndoState.height !== currentState.height)
      ) {
        // if the size changed just replace the last step with a resized one
        this.undoRedoManager.replaceLastUndoStep(currentState);
        this.dispatchEvent(
          new CustomEvent<MarkerAreaEventData>('areastatechange', {
            detail: { markerArea: this },
          }),
        );
      } else {
        const stepAdded = this.undoRedoManager.addUndoStep(currentState);
        if (stepAdded) {
          this.dispatchEvent(
            new CustomEvent<MarkerAreaEventData>('areastatechange', {
              detail: { markerArea: this },
            }),
          );
        }
      }
    }
  }

  /**
   * Undo last action.
   */
  public undo(): void {
    // this.addUndoStep(); // this seems illogical, but it was here for some reason, commenting for now in case regressions occur
    this.undoStep();
  }

  private undoStep(): void {
    const stepData = this.undoRedoManager.undo();
    if (stepData !== undefined) {
      this.restoreState(stepData, false);
    }
  }

  /**
   * Redo previously undone action.
   */
  public redo(): void {
    this.redoStep();
  }

  private redoStep(): void {
    const stepData = this.undoRedoManager.redo();
    if (stepData !== undefined) {
      this.restoreState(stepData, false);
      this.dispatchEvent(
        new CustomEvent<MarkerAreaEventData>('areastatechange', {
          detail: { markerArea: this },
        }),
      );
    }
  }

  /**
   * Adds "defs" to main canvas SVG.
   * Useful for filters, custom fonts and potentially other scenarios.
   *
   * @param nodes
   * @since 3.3.0
   */
  public addDefs(...nodes: (string | Node)[]): void {
    this._defs.push(...nodes);

    if (this._defsElement) {
      this._defsElement.append(...nodes);
    }
  }

  addEventListener<T extends keyof MarkerAreaEventMap>(
    // the event name, a key of MarkerAreaEventMap
    type: T,

    // the listener, using a value of MarkerAreaEventMap
    listener: (this: MarkerArea, ev: MarkerAreaEventMap[T]) => void,

    // any options
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    super.addEventListener(type, listener, options);
  }

  removeEventListener<T extends keyof MarkerAreaEventMap>(
    // the event name, a key of MarkerAreaEventMap
    type: T,

    // the listener, using a value of MarkerAreaEventMap
    listener: (this: MarkerArea, ev: MarkerAreaEventMap[T]) => void,

    // any options
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions | undefined,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions | undefined,
  ): void {
    super.removeEventListener(type, listener, options);
  }
}
