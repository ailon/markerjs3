import { FrameMarker, IPoint, MarkerBase } from './core';
import { SvgHelper } from './core/SvgHelper';
import { MarkerBaseEditor } from './editor/MarkerBaseEditor';
import { ShapeOutlineMarkerEditor } from './editor/ShapeOutlineMarkerEditor';

export interface MarkerAreaEventMap {
  /**
   * Marker area initialized.
   */
  markerareainit: CustomEvent<MarkerAreaEventData>;
}

export interface MarkerAreaEventData {
  /**
   * {@link MarkerArea} instance.
   */
  markerArea: MarkerArea;
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

  private _isInitialized = false;

  private _currentMarkerEditor?: MarkerBaseEditor;

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
  > = new Map([[FrameMarker, ShapeOutlineMarkerEditor<FrameMarker>]]);

  public editors: MarkerBaseEditor[] = [];

  public zoomSteps = [0.5, 0.8, 1, 1.5, 2, 4];
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
      this._mainCanvas.style.width = `${this._targetWidth * this.zoomLevel}px`;
      this._mainCanvas.style.height = `${
        this._targetHeight * this.zoomLevel
      }px`;
      //this._mainCanvas.style.transform = `scale(${this._zoomLevel})`;
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

  constructor() {
    super();

    this.connectedCallback = this.connectedCallback.bind(this);
    this.disconnectedCallback = this.disconnectedCallback.bind(this);

    this.createLayout = this.createLayout.bind(this);
    this.addMainCanvas = this.addMainCanvas.bind(this);
    this.setMainCanvasSize = this.setMainCanvasSize.bind(this);
    this.initOverlay = this.initOverlay.bind(this);
    this.addTargetImage = this.addTargetImage.bind(this);

    this.attachEvents = this.attachEvents.bind(this);
    this.attachWindowEvents = this.attachWindowEvents.bind(this);
    this.detachEvents = this.detachEvents.bind(this);
    this.detachWindowEvents = this.detachWindowEvents.bind(this);

    this.onCanvasPointerDown = this.onCanvasPointerDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerOut = this.onPointerOut.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    this.createMarker = this.createMarker.bind(this);
    this.addNewMarker = this.addNewMarker.bind(this);
    this.markerCreated = this.markerCreated.bind(this);

    this.attachShadow({ mode: 'open' });
  }

  private connectedCallback() {
    this.createLayout();
    this.addMainCanvas();
    this.initOverlay();
    this.attachEvents();
    this._isInitialized = true;
    if (this.targetImage !== undefined) {
      this.addTargetImage();
    }
    this.setMainCanvasSize();
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
    //this._mainCanvas.style.transform = `scale(${this._zoomLevel})`;

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
      this._mainCanvas.setAttribute('width', this._targetWidth.toString());
      this._mainCanvas.setAttribute('height', this._targetHeight.toString());
      this._mainCanvas.setAttribute(
        'viewBox',
        '0 0 ' +
          this._targetWidth.toString() +
          ' ' +
          this._targetHeight.toString(),
      );
      // @todo zoom
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

  public createMarker(markerType: typeof MarkerBase) {
    const markerEditor = this.markerEditors.get(markerType);
    if (markerEditor && this._mainCanvas) {
      this.setCurrentEditor();
      this._currentMarkerEditor = this.addNewMarker(markerEditor, markerType);
      this._currentMarkerEditor.onMarkerCreated = this.markerCreated;

      this._mainCanvas.style.cursor = 'crosshair';
    }
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
      // @todo
      // if (
      //   editor instanceof FreehandMarker &&
      //   this.settings.newFreehandMarkerOnPointerUp
      // ) {
      //   this.createNewMarker(FreehandMarker);
      // }
      // this.addUndoStep();
      // this.eventListeners['markercreate'].forEach((listener) =>
      //   listener(new MarkerEvent(this, this._currentMarker)),
      // );
    }
  }

  public setCurrentEditor(editor?: MarkerBaseEditor): void {
    if (this._currentMarkerEditor !== editor) {
      // no need to deselect if not changed
      if (this._currentMarkerEditor !== undefined) {
        this._currentMarkerEditor.deselect();

        // @todo
        // if (!this._isResizing) {
        //   this.eventListeners['markerdeselect'].forEach((listener) =>
        //     listener(new MarkerEvent(this, this._currentMarker))
        //   );
        // }
      }
    }
    this._currentMarkerEditor = editor;
    if (
      this._currentMarkerEditor !== undefined &&
      !this._currentMarkerEditor.isSelected
    ) {
      if (this._currentMarkerEditor.state !== 'new') {
        this._currentMarkerEditor.select();
      }

      // @todo
      // if (!this._isResizing) {
      //   this.eventListeners['markerselect'].forEach((listener) =>
      //     listener(new MarkerEvent(this, this._currentMarker))
      //   );
      // }
    }
  }

  private touchPoints = 0;
  private isDragging = false;

  private onCanvasPointerDown(ev: PointerEvent) {
    // @todo ?
    // if (!this._isFocused) {
    //   this.focus();
    // }

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
          ),
        );
      } else if (this.mode === 'select') {
        const hitMarker = this.editors.find((m) => m.ownsTarget(ev.target));
        if (hitMarker !== undefined) {
          this.setCurrentEditor(hitMarker);
          this.isDragging = true;
          this._currentMarkerEditor!.pointerDown(
            SvgHelper.clientToLocalCoordinates(
              this._mainCanvas,
              ev.clientX,
              ev.clientY,
            ),
            ev.target ?? undefined,
          );
        } else {
          this.setCurrentEditor();
          this.isDragging = true;
          this.prevPanPoint = { x: ev.clientX, y: ev.clientY };
        }
      }
    }
  }

  private onPointerMove(ev: PointerEvent) {
    if (this.touchPoints === 1 || ev.pointerType !== 'touch') {
      if (this._currentMarkerEditor !== undefined || this.isDragging) {
        // don't swallow the event when editing text markers
        if (
          this._currentMarkerEditor === undefined ||
          this._currentMarkerEditor.state !== 'edit'
        ) {
          ev.preventDefault();
        }

        if (this._currentMarkerEditor !== undefined) {
          this._currentMarkerEditor.manipulate(
            SvgHelper.clientToLocalCoordinates(
              this._mainCanvas,
              ev.clientX,
              ev.clientY,
            ),
          );
        } else if (this.zoomLevel > 1) {
          this.panTo({ x: ev.clientX, y: ev.clientY });
        }
      }
    }
  }

  private onPointerUp(ev: PointerEvent) {
    if (this.touchPoints > 0) {
      this.touchPoints--;
    }
    if (this.touchPoints === 0) {
      if (this.isDragging && this._currentMarkerEditor !== undefined) {
        this._currentMarkerEditor.pointerUp(
          SvgHelper.clientToLocalCoordinates(
            this._mainCanvas,
            ev.clientX,
            ev.clientY,
          ),
        );
      }
    }
    this.isDragging = false;
    // @todo
    // this.addUndoStep();
  }

  private onPointerOut(/*ev: PointerEvent*/) {
    if (this.touchPoints > 0) {
      this.touchPoints--;
    }
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
    // this._mainCanvas?.addEventListener('dblclick', this.onDblClick);

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
