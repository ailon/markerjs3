import { SvgHelper } from "./core/SvgHelper";

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

export class MarkerArea extends HTMLElement {
  private _contentContainer?: HTMLDivElement;
  private _canvasContainer?: HTMLDivElement;

  private _overlayContainer!: HTMLDivElement;
  private _overlayContentContainer!: HTMLDivElement;

  private _mainCanvas?: SVGSVGElement;
  private _groupLayer?: SVGGElement;

  private width = 0;
  private height = 0;

  private _isInitialized = false;

  constructor() {
    super();

    this.connectedCallback = this.connectedCallback.bind(this);
    this.disconnectedCallback = this.disconnectedCallback.bind(this);

    this.createLayout = this.createLayout.bind(this);
    this.addMainCanvas = this.addMainCanvas.bind(this);
    this.setMainCanvasSize = this.setMainCanvasSize.bind(this);
    this.initOverlay = this.initOverlay.bind(this);

    this.attachEvents = this.attachEvents.bind(this);
    this.attachWindowEvents = this.attachWindowEvents.bind(this);
    this.detachEvents = this.detachEvents.bind(this);
    this.detachWindowEvents = this.detachWindowEvents.bind(this);

    this.attachShadow({ mode: 'open' });
  }

  private connectedCallback() {
    this.createLayout();
    this.addMainCanvas();
    this.initOverlay();
    this.attachEvents();
    this._isInitialized = true;
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
      'svg'
    );
    this._mainCanvas.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.setMainCanvasSize();
    this._mainCanvas.style.gridColumnStart = '1';
    this._mainCanvas.style.gridRowStart = '1';
    this._mainCanvas.style.pointerEvents = 'auto';
    this._mainCanvas.style.backgroundColor = 'pink'; // @todo
    this._mainCanvas.style.margin = '10px';
    //this._mainCanvas.style.transform = `scale(${this._zoomLevel})`;

    this._groupLayer = SvgHelper.createGroup();

    this._mainCanvas.appendChild(this._groupLayer);

    this._canvasContainer?.appendChild(this._mainCanvas);
  }

  private setMainCanvasSize() {
    if (this._mainCanvas !== undefined) {
      // @todo
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

  private attachEvents() {
    // needed to distinguish when the element is in focus (active)
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    // @todo
    // this.setupResizeObserver();
    // this._mainCanvas?.addEventListener('pointerdown', this.onCanvasPointerDown);
    // this._mainCanvas?.addEventListener('pointermove', this.onCanvasPointerMove);
    // this._mainCanvas?.addEventListener('pointerup', this.onCanvasPointerUp);
    // this._mainCanvas?.addEventListener('pointerout', this.onCanvasPointerOut);
    // this._mainCanvas?.addEventListener('dblclick', this.onDblClick);
    this.attachWindowEvents();
  }

  private attachWindowEvents() {
    // @todo
    // window.addEventListener('pointermove', this.onPointerMove);
    // window.addEventListener('pointerup', this.onPointerUp);
    // window.addEventListener('pointercancel', this.onPointerOut);
    // window.addEventListener('pointerout', this.onPointerOut);
    // window.addEventListener('pointerleave', this.onPointerUp);
    // window.addEventListener('keyup', this.onKeyUp);
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
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions | undefined
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ): void {
    super.addEventListener(type, listener, options);
  }

  removeEventListener<T extends keyof MarkerAreaEventMap>(
    // the event name, a key of MarkerAreaEventMap
    type: T,

    // the listener, using a value of MarkerAreaEventMap
    listener: (this: MarkerArea, ev: MarkerAreaEventMap[T]) => void,

    // any options
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions | undefined
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions | undefined
  ): void {
    super.removeEventListener(type, listener, options);
  }  
}