import {
  AnnotationState,
  CalloutMarker,
  CaptionFrameMarker,
  CheckImageMarker,
  CoverMarker,
  CustomImageMarker,
  EllipseFrameMarker,
  EllipseMarker,
  FrameMarker,
  FreehandMarker,
  HighlightMarker,
  IPoint,
  LineMarker,
  MarkerBase,
  PolygonMarker,
  TextMarker,
  XImageMarker,
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

export interface MarkerAreaEventMap {
  /**
   * Marker area initialized.
   */
  areainit: CustomEvent<MarkerAreaEventData>;
  areashow: CustomEvent<MarkerAreaEventData>;
  arearestorestate: CustomEvent<MarkerAreaEventData>;
  areafocus: CustomEvent<MarkerAreaEventData>;
  areablur: CustomEvent<MarkerAreaEventData>;
  areastatechange: CustomEvent<MarkerAreaEventData>;

  markerselect: CustomEvent<MarkerEditorEventData>;
  markerdeselect: CustomEvent<MarkerEditorEventData>;
  markercreating: CustomEvent<MarkerEditorEventData>;
  markercreate: CustomEvent<MarkerEditorEventData>;
  markerbeforedelete: CustomEvent<MarkerEditorEventData>;
  markerdelete: CustomEvent<MarkerEditorEventData>;
  markerchange: CustomEvent<MarkerEditorEventData>;
}

export interface MarkerAreaEventData {
  /**
   * {@link MarkerArea} instance.
   */
  markerArea: MarkerArea;
}

export interface MarkerEditorEventData extends MarkerAreaEventData {
  markerEditor: MarkerBaseEditor;
}

/**
 * @ignore
 */
export type MarkerAreaMode = 'select' | 'create' | 'delete';

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
  public get targetWidth() {
    return this._targetWidth;
  }
  public set targetWidth(value) {
    this._targetWidth = value;
    this.setMainCanvasSize();
  }
  private _targetHeight = -1;
  public get targetHeight() {
    return this._targetHeight;
  }
  public set targetHeight(value) {
    this._targetHeight = value;
    this.setMainCanvasSize();
  }

  private mode: MarkerAreaMode = 'select';

  private _logoUI?: HTMLElement;

  private _isInitialized = false;

  private _currentMarkerEditor?: MarkerBaseEditor;
  public get currentMarkerEditor(): MarkerBaseEditor | undefined {
    return this._currentMarkerEditor;
  }
  private _selectedMarkerEditors: MarkerBaseEditor[] = [];

  private _newMarkerOutline: SVGPathElement = SvgHelper.createPath('', [
    ['stroke', '#333'],
    ['stroke-width', '0.5'],
    ['stroke-dasharray', '2 5'],
    ['fill', 'rgba(200,200,200,0.5)'],
    ['pointer-events', 'none'],
  ]);

  private _targetImage: HTMLImageElement | undefined;
  public get targetImage(): HTMLImageElement | undefined {
    return this._targetImage;
  }
  public set targetImage(value: HTMLImageElement | undefined) {
    this._targetImage = value;
    if (value !== undefined) {
      this.addTargetImage();
    }
  }

  public markerEditors: Map<
    typeof MarkerBase,
    typeof MarkerBaseEditor<MarkerBase>
  > = new Map();

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
      //this.setMainCanvasSize();
      this._mainCanvas.style.transform = `scale(${this._zoomLevel})`;
      this.setEditingTargetSize();
      this._canvasContainer.scrollTo({
        left:
          (this._mainCanvas.clientWidth - this._canvasContainer.clientWidth) /
          2,
        top:
          (this._mainCanvas.clientHeight - this._canvasContainer.clientHeight) /
          2,
      });

      this._overlayContainer.style.transform = `scale(${this._zoomLevel})`;
    }
  }

  private prevPanPoint: IPoint = { x: 0, y: 0 };
  private panTo(point: IPoint) {
    // @todo
    // this.contentDiv.scrollBy({
    //   left: this.prevPanPoint.x - point.x,
    //   top: this.prevPanPoint.y - point.y,
    // });
    this.prevPanPoint = point;
  }

  private undoRedoManager = new UndoRedoManager<AnnotationState>();

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
    this.markerEditors.set(EllipseMarker, ShapeMarkerEditor<HighlightMarker>);
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

    this._groupLayer = SvgHelper.createGroup();

    this._mainCanvas.appendChild(this._groupLayer);

    this._canvasContainer?.appendChild(this._mainCanvas);
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
          if (this._targetHeight <= 0 && this._targetWidth <= 0) {
            const img = <HTMLImageElement>ev.target;
            this._targetWidth =
              img.clientWidth > 0 ? img.clientWidth : img.naturalWidth;
            this._targetHeight =
              img.clientHeight > 0 ? img.clientHeight : img.naturalHeight;
          }
          this._editingTarget.width = this._targetWidth;
          this._editingTarget.height = this._targetHeight;
          this._editingTarget.style.width = `${this._targetWidth}px`;
          this._editingTarget.style.height = `${this._targetHeight}px`;
          this._editingTarget.style.gridColumnStart = '1';
          this._editingTarget.style.gridRowStart = '1';

          this.setMainCanvasSize();
        }
      });
      this._editingTarget.src = this.targetImage.src;

      this._canvasContainer.insertBefore(this._editingTarget, this._mainCanvas);
    }
  }

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

  public deleteSelectedMarkers() {
    this._selectedMarkerEditors.forEach((m) => this.deleteMarker(m));
    this._selectedMarkerEditors.splice(0);
  }

  public setCurrentEditor(editor?: MarkerBaseEditor): void {
    if (this._currentMarkerEditor !== editor) {
      // no need to deselect if not changed
      if (this._currentMarkerEditor !== undefined) {
        this._currentMarkerEditor.deselect();

        // @todo
        // if (!this._isResizing) {
        this.dispatchEvent(
          new CustomEvent<MarkerEditorEventData>('markerdeselect', {
            detail: {
              markerArea: this,
              markerEditor: this._currentMarkerEditor,
            },
          }),
        );
        // }
      }
    }
    this._currentMarkerEditor = editor;
    if (
      this._currentMarkerEditor !== undefined &&
      !this._currentMarkerEditor.isSelected
    ) {
      if (this._currentMarkerEditor.state !== 'new') {
        this._selectedMarkerEditors.push(this._currentMarkerEditor);
        this._currentMarkerEditor.select();
      }

      // @todo
      // if (!this._isResizing) {
      this.dispatchEvent(
        new CustomEvent<MarkerEditorEventData>('markerselect', {
          detail: { markerArea: this, markerEditor: this._currentMarkerEditor },
        }),
      );
      // }
    }
  }

  public selectEditor(editor: MarkerBaseEditor): void {
    if (this._selectedMarkerEditors.indexOf(editor) < 0) {
      if (this._selectedMarkerEditors.length > 0) {
        this._selectedMarkerEditors[0].select(true);
      }
      this._selectedMarkerEditors.push(editor);
      editor.select(true);
    }
  }

  public deselectEditor(editor?: MarkerBaseEditor): void {
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
  }

  private touchPoints = 0;
  private isDragging = false;
  private isSelecting = false;

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
    if (this.touchPoints === 1 || ev.pointerType !== 'touch') {
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
          } else if (!hitMarker.isSelected) {
            this.deselectEditor();
            this.setCurrentEditor(hitMarker);
          }
          this._selectedMarkerEditors.forEach((m) =>
            m.pointerDown(localPoint, ev.target ?? undefined),
          );
        } else if (
          ev.target === this._marqueeSelectOutline &&
          this._selectedMarkerEditors.length > 1
        ) {
          this.isDragging = true;
          this._selectedMarkerEditors.forEach((m) =>
            m.pointerDown(localPoint, ev.target ?? undefined),
          );
        } else {
          this.setCurrentEditor();
          this.deselectEditor();
          this.isSelecting = true;
          this.isDragging = true;

          // marquee select
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

          this.prevPanPoint = { x: ev.clientX, y: ev.clientY };
        }
      }
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
        );
      } else {
        this.setCurrentEditor();
      }
    }
  }

  private onPointerMove(ev: PointerEvent) {
    if (
      this.touchPoints === 1 ||
      (ev.pointerType !== 'touch' && this.isDragging)
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
              m.manipulate(localPoint),
            );
          } else {
            this._currentMarkerEditor?.manipulate(localPoint);
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
    }
    if (this.touchPoints === 0) {
      if (this.isDragging && this._currentMarkerEditor !== undefined) {
        const localPoint = SvgHelper.clientToLocalCoordinates(
          this._mainCanvas,
          ev.clientX,
          ev.clientY,
          this.zoomLevel,
        );

        if (this._selectedMarkerEditors.length > 1) {
          this._selectedMarkerEditors.forEach((m) => m.pointerUp(localPoint));
        } else {
          this._currentMarkerEditor.pointerUp(localPoint);
        }

        this.hideOutline();
      } else if (this.isSelecting) {
        // finish marquee selection
        this.finishMarqueeSelection();
        if (this._selectedMarkerEditors.length < 2) {
          this.hideMarqueeSelectOutline();
        }
      }
    }
    this.isDragging = false;
    this.isSelecting = false;
    this.addUndoStep();
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

  public switchToSelectMode() {
    this.setCurrentEditor();
    if (this._mainCanvas) {
      this._mainCanvas.style.cursor = 'default';
    }
  }

  public getState(): AnnotationState {
    const result: AnnotationState = {
      version: 3,
      width: this.targetWidth,
      height: this.targetHeight,

      markers: this.editors.map((editor) => {
        return editor.getState();
      }),
    };

    return JSON.parse(JSON.stringify(result));
  }

  public restoreState(state: AnnotationState): void {
    const stateCopy: AnnotationState = JSON.parse(JSON.stringify(state));
    this.editors.splice(0);

    while (this._mainCanvas?.lastChild) {
      this._mainCanvas.removeChild(this._mainCanvas.lastChild);
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
   * by visiting https://markerjs.com/buy for details
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
    this.addUndoStep();
    this.undoStep();
  }

  private undoStep(): void {
    const stepData = this.undoRedoManager.undo();
    if (stepData !== undefined) {
      this.restoreState(stepData);
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
      this.restoreState(stepData);
      this.dispatchEvent(
        new CustomEvent<MarkerAreaEventData>('areastatechange', {
          detail: { markerArea: this },
        }),
      );
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
