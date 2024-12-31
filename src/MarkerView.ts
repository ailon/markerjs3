import {
  AnnotationState,
  CoverMarker,
  FrameMarker,
  FreehandMarker,
  HighlightMarker,
  MarkerBase,
  PolygonMarker,
  SvgHelper,
  TextMarker,
  LineMarker,
  MeasurementMarker,
  ArrowMarker,
  EllipseFrameMarker,
  EllipseMarker,
  CustomImageMarker,
} from './core';
import { Activator } from './core/Activator';

import Logo from './assets/markerjs-logo-m.svg';
import { CalloutMarker } from './core/CalloutMarker';

export interface MarkerViewEventMap {
  /**
   * Viewer initialized.
   */
  viewinit: CustomEvent<MarkerViewEventData>;

  viewshow: CustomEvent<MarkerViewEventData>;

  viewrestorestate: CustomEvent<MarkerViewEventData>;
}

export interface MarkerViewEventData {
  /**
   * {@link MarkerView} instance.
   */
  markerView: MarkerView;
}

export class MarkerView extends HTMLElement {
  private _contentContainer?: HTMLDivElement;
  private _canvasContainer?: HTMLDivElement;

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

  public markerTypes: Array<typeof MarkerBase> = [];

  public markers: MarkerBase[] = [];

  private _logoUI?: HTMLElement;

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
    if (this._canvasContainer && this._contentContainer && this._mainCanvas) {
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
    }
  }

  private _isInitialized = false;

  constructor() {
    super();

    this.markerTypes = [
      FrameMarker,
      LineMarker,
      ArrowMarker,
      MeasurementMarker,
      PolygonMarker,
      FreehandMarker,
      TextMarker,
      CoverMarker,
      HighlightMarker,
      CalloutMarker,
      EllipseFrameMarker,
      EllipseMarker,
      CustomImageMarker,
    ];

    this.connectedCallback = this.connectedCallback.bind(this);
    this.disconnectedCallback = this.disconnectedCallback.bind(this);

    this.createLayout = this.createLayout.bind(this);
    this.addMainCanvas = this.addMainCanvas.bind(this);
    this.setMainCanvasSize = this.setMainCanvasSize.bind(this);
    this.setEditingTargetSize = this.setEditingTargetSize.bind(this);
    this.addTargetImage = this.addTargetImage.bind(this);

    this.attachEvents = this.attachEvents.bind(this);
    this.attachWindowEvents = this.attachWindowEvents.bind(this);
    this.detachEvents = this.detachEvents.bind(this);
    this.detachWindowEvents = this.detachWindowEvents.bind(this);

    this.addNewMarker = this.addNewMarker.bind(this);

    this.show = this.show.bind(this);
    this.scaleMarkers = this.scaleMarkers.bind(this);

    this.toggleLogo = this.toggleLogo.bind(this);
    this.addLogo = this.addLogo.bind(this);
    this.removeLogo = this.removeLogo.bind(this);

    this.attachShadow({ mode: 'open' });
  }

  private connectedCallback() {
    this.dispatchEvent(
      new CustomEvent<MarkerViewEventData>('viewinit', {
        detail: { markerView: this },
      }),
    );
    Activator.addKeyAddListener(this.toggleLogo);
    this.createLayout();
    this.addMainCanvas();
    this.attachEvents();
    this._isInitialized = true;
    if (this.targetImage !== undefined) {
      this.addTargetImage();
    }
    this.setMainCanvasSize();
    this.toggleLogo();
    this.dispatchEvent(
      new CustomEvent<MarkerViewEventData>('viewshow', {
        detail: { markerView: this },
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

  private addNewMarker(markerType: typeof MarkerBase): MarkerBase {
    if (this._mainCanvas === undefined) {
      throw new Error('Main canvas is not initialized.');
    }

    const g = SvgHelper.createGroup();
    this._mainCanvas.appendChild(g);

    return new markerType(g);
  }

  private attachEvents() {
    // needed to distinguish when the element is in focus (active)
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    // @todo
    // this.setupResizeObserver();

    this.attachWindowEvents();
  }

  private attachWindowEvents() {
    // @todo
    // window.addEventListener('pointermove', this.onPointerMove);
    // window.addEventListener('pointerup', this.onPointerUp);
    // window.addEventListener('pointercancel', this.onPointerOut);
    // window.addEventListener('pointerout', this.onPointerOut);
    // window.addEventListener('pointerleave', this.onPointerUp);
  }

  private detachEvents() {
    // @todo
    // if (this._resizeObserver && this._container) {
    //   this._resizeObserver.unobserve(this._container);
    // }
    // this._mainCanvas?.removeEventListener('pointerdown', this.onPointerDown);
    // this._mainCanvas?.removeEventListener(
    //   'pointerdown',
    //   this.onStencilPointerUp
    // );
    this.detachWindowEvents();
  }

  private detachWindowEvents() {
    // @todo
    // window.removeEventListener('pointermove', this.onPointerMove);
    // window.removeEventListener('pointerup', this.onPointerUp);
    // window.removeEventListener('pointercancel', this.onPointerOut);
    // window.removeEventListener('pointerout', this.onPointerOut);
    // window.removeEventListener('pointerleave', this.onPointerUp);
  }

  private getMarkerTypeByName(typeName: string): typeof MarkerBase | undefined {
    let result: typeof MarkerBase | undefined;
    this.markerTypes.forEach((mType) => {
      if (mType.typeName === typeName) {
        result = mType;
      }
    });
    return result;
  }

  public show(state: AnnotationState): void {
    const stateCopy: AnnotationState = JSON.parse(JSON.stringify(state));
    this.markers.splice(0);

    while (this._mainCanvas?.lastChild) {
      this._mainCanvas.removeChild(this._mainCanvas.lastChild);
    }

    stateCopy.markers.forEach((markerState) => {
      const markerType = this.getMarkerTypeByName(markerState.typeName);
      if (markerType !== undefined) {
        const marker = this.addNewMarker(markerType);
        marker.restoreState(markerState);
        this.markers.push(marker);
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
      new CustomEvent<MarkerViewEventData>('viewrestorestate', {
        detail: { markerView: this },
      }),
    );
  }

  private scaleMarkers(scaleX: number, scaleY: number) {
    this.markers.forEach((marker) => {
      marker.scale(scaleX, scaleY);
    });
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
    if (!Activator.isLicensed('MJS3V') && !Activator.isLicensed('MJS3')) {
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

  addEventListener<T extends keyof MarkerViewEventMap>(
    // the event name, a key of MarkerViewEventMap
    type: T,

    // the listener, using a value of MarkerViewEventMap
    listener: (this: MarkerView, ev: MarkerViewEventMap[T]) => void,

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

  removeEventListener<T extends keyof MarkerViewEventMap>(
    // the event name, a key of MarkerViewEventMap
    type: T,

    // the listener, using a value of MarkerViewEventMap
    listener: (this: MarkerView, ev: MarkerViewEventMap[T]) => void,

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
