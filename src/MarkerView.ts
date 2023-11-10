import { SvgHelper } from "./core";

export interface MarkerViewEventMap {
  /**
   * Viewer initialized.
   */
  viewinit: CustomEvent<MarkerViewEventData>;
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

  private width = 0;
  private height = 0;

  constructor() {
    super();

    this.connectedCallback = this.connectedCallback.bind(this);
    this.disconnectedCallback = this.disconnectedCallback.bind(this);

    this.createLayout = this.createLayout.bind(this);
    this.addMainCanvas = this.addMainCanvas.bind(this);
    this.setMainCanvasSize = this.setMainCanvasSize.bind(this);
    
    this.attachEvents = this.attachEvents.bind(this);
    this.attachWindowEvents = this.attachWindowEvents.bind(this);
    this.detachEvents = this.detachEvents.bind(this);
    this.detachWindowEvents = this.detachWindowEvents.bind(this);

    this.attachShadow({ mode: 'open' });
  }

  private connectedCallback() {
    this.createLayout();
    this.addMainCanvas();
    this.attachEvents();
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
    this._contentContainer.style.display = 'grid';
    this._contentContainer.style.position = 'relative';
    this._contentContainer.style.flexGrow = '2';
    this._contentContainer.style.flexShrink = '1';
    this._contentContainer.style.overflow = 'hidden';
    this._contentContainer.style.gridTemplateColumns = '1fr';
    this._contentContainer.style.backgroundColor = 'red';

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
    this._canvasContainer.style.gridRow = '1/3';
    this._canvasContainer.style.gridColumn = '1';
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
    this._mainCanvas.style.pointerEvents = 'auto';

    this._mainCanvas.style.fontFamily = 'Helvetica, Arial, Sans-Serif';
    this._mainCanvas.style.backgroundColor = 'teal'; // @todo
    this._mainCanvas.style.filter = 'var(--i-mjsdiav-canvas-filter)';

    this._groupLayer = SvgHelper.createGroup();

    this._mainCanvas.appendChild(this._groupLayer);

    this._canvasContainer?.appendChild(this._mainCanvas);
  }  

  private setMainCanvasSize() {
    if (this._mainCanvas !== undefined) {
      // @todo
      // this._mainCanvas.setAttribute('width', this.documentWidth.toString());
      // this._mainCanvas.setAttribute('height', this.documentHeight.toString());
      // this._mainCanvas.setAttribute(
      //   'viewBox',
      //   '0 0 ' +
      //     this.documentWidth.toString() +
      //     ' ' +
      //     this.documentHeight.toString()
      // );
      // this.zoomLevel = this.zoomLevel * 1;
    }
  }

  private attachEvents() {
    // @todo
    // this.setupResizeObserver();
    // this._mainCanvas?.addEventListener('pointerdown', this.onPointerDown);
    // this._mainCanvas?.addEventListener('pointerup', this.onStencilPointerUp);
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

  addEventListener<T extends keyof MarkerViewEventMap>(
    // the event name, a key of MarkerViewEventMap
    type: T,

    // the listener, using a value of MarkerViewEventMap
    listener: (this: MarkerView, ev: MarkerViewEventMap[T]) => void,

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

  removeEventListener<T extends keyof MarkerViewEventMap>(
    // the event name, a key of MarkerViewEventMap
    type: T,

    // the listener, using a value of MarkerViewEventMap
    listener: (this: MarkerView, ev: MarkerViewEventMap[T]) => void,

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
