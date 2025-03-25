/**
 * @module Renderer
 * @category API Reference
 */
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
  ArrowMarker,
  MeasurementMarker,
  EllipseFrameMarker,
  EllipseMarker,
  CalloutMarker,
  CustomImageMarker,
  CheckImageMarker,
  XImageMarker,
  CaptionFrameMarker,
  CurveMarker,
  HighlighterMarker,
  SvgFilters,
} from './core';

/**
 * Renderer is used to rasterize annotations.
 *
 * @example
 * To render the annotation as a static image you use `Renderer`.
 *
 * ```js
 * import { MarkerArea, Renderer } from '@markerjs/markerjs3';
 * ```
 *
 * Just create an instance of it and pass the annotation state to the `rasterize()` method:
 *
 * ```js
 * const renderer = new Renderer();
 * renderer.targetImage = targetImg;
 * const dataUrl = await renderer.rasterize(markerArea.getState());
 *
 * const img = document.createElement('img');
 * img.src = dataUrl;
 *
 * someDiv.appendChild(img);
 * ```
 */
export class Renderer {
  private _mainCanvas?: SVGSVGElement;

  private _editingTarget?: HTMLImageElement;

  private _renderHelperContainer?: HTMLDivElement;

  private _targetWidth = -1;
  /**
   * Width of the target image.
   */
  public get targetWidth() {
    return this._targetWidth;
  }
  /**
   * Width of the target image.
   */
  public set targetWidth(value) {
    this._targetWidth = value;
    this.setMainCanvasSize();
  }
  private _targetHeight = -1;
  /**
   * Height of the target image.
   */
  public get targetHeight() {
    return this._targetHeight;
  }
  /**
   * Height of the target image.
   */
  public set targetHeight(value) {
    this._targetHeight = value;
    this.setMainCanvasSize();
  }

  private _targetImageLoaded = false;

  private _targetImage: HTMLImageElement | undefined;
  /**
   * Target image to render annotations on.
   */
  public get targetImage(): HTMLImageElement | undefined {
    return this._targetImage;
  }
  /**
   * Target image to render annotations on.
   */
  public set targetImage(value: HTMLImageElement | undefined) {
    this._targetImageLoaded = false;
    this._targetImage = value;
    if (value !== undefined) {
      this.addTargetImage();
    }
  }

  /**
   * Marker types available for rendering.
   */
  public markerTypes: Array<typeof MarkerBase> = [];

  /**
   * Array of markers to render.
   */
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
   * Sets the default SVG filter for the created markers
   * (e.g. "drop-shadow(2px 2px 2px black)").
   *
   * @since 3.2.0
   */
  public set defaultFilter(value: string | undefined) {
    this._defaultFilter = value;
  }

  private _defsElement?: SVGDefsElement;
  private _defs: (string | Node)[] = [];

  constructor() {
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
      CheckImageMarker,
      XImageMarker,
      CaptionFrameMarker,
      CurveMarker,
      HighlighterMarker,
    ];

    this.init = this.init.bind(this);

    this.addMainCanvas = this.addMainCanvas.bind(this);
    this.setMainCanvasSize = this.setMainCanvasSize.bind(this);
    this.setEditingTargetSize = this.setEditingTargetSize.bind(this);
    this.addTargetImage = this.addTargetImage.bind(this);

    this.addNewMarker = this.addNewMarker.bind(this);

    this.restoreState = this.restoreState.bind(this);
    this.scaleMarkers = this.scaleMarkers.bind(this);

    this.addDefs = this.addDefs.bind(this);
    this.addDefaultFilterDefs = this.addDefaultFilterDefs.bind(this);
  }

  private init() {
    this.addMainCanvas();
    this._isInitialized = true;
    if (this.targetImage !== undefined) {
      this.addTargetImage();
    }
    this.setMainCanvasSize();
    this.addDefaultFilterDefs();
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

    this.addDefsToMainCanvas();

    this._renderHelperContainer = document.createElement('div');
    this._renderHelperContainer.style.position = 'absolute';
    this._renderHelperContainer.style.top = '0px';
    this._renderHelperContainer.style.left = '0px';
    this._renderHelperContainer.style.width = '10px';
    this._renderHelperContainer.style.height = '10px';
    this._renderHelperContainer.style.overflow = 'hidden';
    this._renderHelperContainer.style.visibility = 'hidden';

    this._renderHelperContainer.appendChild(this._mainCanvas);

    document.body.appendChild(this._renderHelperContainer);
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
          if (this._targetHeight <= 0 || this._targetWidth <= 0) {
            const img = <HTMLImageElement>ev.target;

            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const calculatedWidth =
              this._targetWidth > 0
                ? this._targetWidth
                : this._targetHeight > 0
                ? this._targetHeight * aspectRatio
                : img.naturalWidth;
            const calculatedHeight =
              this._targetHeight > 0
                ? this._targetHeight
                : this._targetWidth > 0
                ? this._targetWidth / aspectRatio
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

          this._targetImageLoaded = true;

          this.setMainCanvasSize();
        }
      });
      this._editingTarget.style.visibility = 'hidden';
      this._editingTarget.src = this.targetImage.src;

      this._renderHelperContainer?.insertBefore(
        this._editingTarget,
        this._mainCanvas,
      );
      // document.body.appendChild(this._editingTarget);
    }
  }

  private addDefaultFilterDefs() {
    this.addDefs(...SvgFilters.getDefaultFilterSet());
  }

  private addNewMarker(markerType: typeof MarkerBase): MarkerBase {
    if (this._mainCanvas === undefined) {
      throw new Error('Main canvas is not initialized.');
    }

    const g = SvgHelper.createGroup();
    if (this.defaultFilter && markerType.applyDefaultFilter) {
      g.setAttribute('filter', this.defaultFilter);
    }
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

  /**
   * Adds a new marker type to the list of available marker types.
   * @param markerType - Marker type to register.
   */
  public registerMarkerType(markerType: typeof MarkerBase) {
    if (this.markerTypes.indexOf(markerType) < 0) {
      this.markerTypes.push(markerType);
    }
  }

  /**
   * Restores the annotation state.
   * @param state - Annotation state to restore.
   */
  public restoreState(state: AnnotationState): void {
    const stateCopy: AnnotationState = JSON.parse(JSON.stringify(state));
    this.markers.splice(0);

    while (this._mainCanvas?.lastChild) {
      this._mainCanvas.removeChild(this._mainCanvas.lastChild);
    }

    // re-add defs
    this.addDefsToMainCanvas();

    if (this.defaultFilter === undefined && stateCopy.defaultFilter) {
      this.defaultFilter = stateCopy.defaultFilter;
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

  /**
   * Rasterizes the annotation.
   * @param state - annotation state to render.
   * @param targetCanvas - optional target canvas to render the annotation on.
   * @returns
   */
  public async rasterize(
    state: AnnotationState,
    targetCanvas?: HTMLCanvasElement,
  ): Promise<string> {
    if (!this.naturalSize && this.targetWidth <= 0 && this.targetHeight <= 0) {
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

    // workaround for text positioning delay
    await new Promise((r) => setTimeout(r, 200));

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
      this._renderHelperContainer?.removeChild(this._editingTarget);
    }

    // remove the helper main canvas from the page
    this._renderHelperContainer?.removeChild(this._mainCanvas);
    document.body.removeChild(this._renderHelperContainer!);

    return result;
  }

  /**
   * Adds "defs" to main canvas SVG.
   * Useful for filters, custom fonts and potentially other scenarios.
   * @since 3.3.0
   */
  public addDefs(...nodes: (string | Node)[]): void {
    this._defs.push(...nodes);

    if (this._defsElement) {
      this._defsElement.append(...nodes);
    }
  }
}
