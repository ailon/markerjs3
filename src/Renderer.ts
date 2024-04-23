import {
  AnnotationState,
  CoverMarker,
  FrameMarker,
  FreehandMarker,
  MarkerBase,
  PolygonMarker,
  SvgHelper,
  TextMarker,
} from './core';
import { LineMarker } from './core/LineMarker';

export class Renderer {
  private _mainCanvas?: SVGSVGElement;

  private _editingTarget?: HTMLImageElement;

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

  private _targetImageLoaded = false;

  private _targetImage: HTMLImageElement | undefined;
  public get targetImage(): HTMLImageElement | undefined {
    return this._targetImage;
  }
  public set targetImage(value: HTMLImageElement | undefined) {
    this._targetImageLoaded = false;
    this._targetImage = value;
    if (value !== undefined) {
      this.addTargetImage();
    }
  }

  public markerTypes: Array<typeof MarkerBase> = [];

  public markers: MarkerBase[] = [];

  private _isInitialized = false;

  /**
   * Whether the image should be rendered at the original (natural) target image size.
   */
  public naturalSize = false;
  /**
   * Rendered image type (`image/png`, `image/jpeg`, etc.).
   */
  public imageType = 'image/png';
  /**
   * For formats that support it, specifies rendering quality.
   *
   * In the case of `image/jpeg` you can specify a value between 0 and 1 (lowest to highest quality).
   *
   * @type {number} - image rendering quality (0..1)
   */
  public imageQuality?: number;
  /**
   * When set to true, only the marker layer without the original image will be rendered.
   */
  public markersOnly = false;

  /**
   * When set and {@linkcode naturalSize} is `false` sets the width of the rendered image.
   *
   * Both `width` and `height` have to be set for this to take effect.
   */
  public width?: number;
  /**
   * When set and {@linkcode naturalSize} is `false` sets the height of the rendered image.
   *
   * Both `width` and `height` have to be set for this to take effect.
   */
  public height?: number;

  constructor() {
    this.markerTypes = [
      FrameMarker,
      LineMarker,
      PolygonMarker,
      FreehandMarker,
      TextMarker,
      CoverMarker,
    ];

    this.init = this.init.bind(this);

    this.addMainCanvas = this.addMainCanvas.bind(this);
    this.setMainCanvasSize = this.setMainCanvasSize.bind(this);
    this.setEditingTargetSize = this.setEditingTargetSize.bind(this);
    this.addTargetImage = this.addTargetImage.bind(this);

    this.addNewMarker = this.addNewMarker.bind(this);

    this.restoreState = this.restoreState.bind(this);
    this.scaleMarkers = this.scaleMarkers.bind(this);
  }

  private init() {
    this.addMainCanvas();
    this._isInitialized = true;
    if (this.targetImage !== undefined) {
      this.addTargetImage();
    }
    this.setMainCanvasSize();
  }

  private addMainCanvas() {
    this._mainCanvas = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    this._mainCanvas.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.setMainCanvasSize();
    this._mainCanvas.style.gridColumnStart = '1';
    this._mainCanvas.style.gridRowStart = '1';
    this._mainCanvas.style.pointerEvents = 'auto';

    // text isn't sized correctly without adding to the DOM
    this._mainCanvas.style.visibility = 'hidden';
    document.body.appendChild(this._mainCanvas);
  }

  private setMainCanvasSize() {
    if (
      this._mainCanvas !== undefined &&
      this._targetHeight > 0 &&
      this._targetWidth > 0
    ) {
      this._mainCanvas.style.width = `${this._targetWidth}px`;
      this._mainCanvas.style.height = `${this._targetHeight}px`;
      this._mainCanvas.setAttribute('width', `${this._targetWidth}`);
      this._mainCanvas.setAttribute('height', `${this._targetHeight}`);
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
      this._editingTarget.width = this._targetWidth;
      this._editingTarget.height = this._targetHeight;
      this._editingTarget.style.width = `${this._targetWidth}px`;
      this._editingTarget.style.height = `${this._targetHeight}px`;
    }
  }

  private addTargetImage() {
    if (
      this._isInitialized &&
      this._editingTarget === undefined &&
      this.targetImage !== undefined &&
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
            this._targetWidth = img.naturalWidth;
            this._targetHeight = img.naturalHeight;
          }
          this._editingTarget.width = this._targetWidth;
          this._editingTarget.height = this._targetHeight;
          this._editingTarget.style.width = `${this._targetWidth}px`;
          this._editingTarget.style.height = `${this._targetHeight}px`;
          this._editingTarget.style.gridColumnStart = '1';
          this._editingTarget.style.gridRowStart = '1';

          this._targetImageLoaded = true;

          this.setMainCanvasSize();
        }
      });
      this._editingTarget.style.visibility = 'hidden';
      this._editingTarget.src = this.targetImage.src;

      // this._canvasContainer.insertBefore(this._editingTarget, this._mainCanvas);
      document.body.appendChild(this._editingTarget);
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

  private getMarkerTypeByName(typeName: string): typeof MarkerBase | undefined {
    let result: typeof MarkerBase | undefined;
    this.markerTypes.forEach((mType) => {
      if (mType.typeName === typeName) {
        result = mType;
      }
    });
    return result;
  }

  public restoreState(state: AnnotationState): void {
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
  }

  private scaleMarkers(scaleX: number, scaleY: number) {
    this.markers.forEach((marker) => {
      marker.scale(scaleX, scaleY);
    });
  }

  public async rasterize(
    state: AnnotationState,
    targetCanvas?: HTMLCanvasElement,
  ): Promise<string> {
    if (!this.naturalSize) {
      this._targetWidth = state.width;
      this._targetHeight = state.height;
    }

    this.init();

    if (this._mainCanvas === undefined || this.targetImage === undefined) {
      throw new Error('Not properly initialized.');
    }

    let counter = 0;
    while (!this._targetImageLoaded && counter++ < 100) {
      // wait for the target image to load
      await new Promise((r) => setTimeout(r, 100));
    }

    this.restoreState(state);

    const canvas =
      targetCanvas !== undefined
        ? targetCanvas
        : document.createElement('canvas');

    if (this.targetImage === null) {
      this.markersOnly = true;
      this.naturalSize = false;
    }

    const markerImageCopy = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    markerImageCopy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    markerImageCopy.setAttribute(
      'width',
      this._mainCanvas.width.baseVal.valueAsString,
    );
    markerImageCopy.setAttribute(
      'height',
      this._mainCanvas.height.baseVal.valueAsString,
    );
    markerImageCopy.setAttribute(
      'viewBox',
      '0 0 ' +
        this._mainCanvas.viewBox.baseVal.width.toString() +
        ' ' +
        this._mainCanvas.viewBox.baseVal.height.toString(),
    );
    markerImageCopy.innerHTML = this._mainCanvas.innerHTML;

    if (this.naturalSize === true) {
      // scale to full image size
      markerImageCopy.width.baseVal.value = this.targetImage.naturalWidth;
      markerImageCopy.height.baseVal.value = this.targetImage.naturalHeight;
    } else if (this.width !== undefined && this.height !== undefined) {
      // scale to specific dimensions
      markerImageCopy.width.baseVal.value = this.width;
      markerImageCopy.height.baseVal.value = this.height;
    }

    canvas.width = markerImageCopy.width.baseVal.value;
    canvas.height = markerImageCopy.height.baseVal.value;

    const data = markerImageCopy.outerHTML;

    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      throw new Error('Canvas 2D context is not available.');
    }

    if (this.markersOnly !== true) {
      ctx.drawImage(this.targetImage, 0, 0, canvas.width, canvas.height);
    }

    const DOMURL = window.URL; // || window.webkitURL || window;

    const img = new Image(canvas.width, canvas.height);
    img.setAttribute('crossOrigin', 'anonymous');

    const blob = new Blob([data], { type: 'image/svg+xml' });

    const url = DOMURL.createObjectURL(blob);

    let result = '';
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);

      result = canvas.toDataURL(this.imageType, this.imageQuality);
    };

    img.src = url;

    counter = 0;
    while (!result && counter++ < 100) {
      // wait for the image to load
      await new Promise((r) => setTimeout(r, 100));
    }

    if (this._editingTarget) {
      document.body.removeChild(this._editingTarget);
    }

    // remove the helper main canvas from the page
    document.body.removeChild(this._mainCanvas);

    return result;
  }
}
