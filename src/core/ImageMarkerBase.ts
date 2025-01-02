import { ImageMarkerBaseState, ImageType } from './ImageMarkerBaseState';
import { RectangularBoxMarkerBase } from './RectangularBoxMarkerBase';
import { SvgHelper } from './SvgHelper';

export class ImageMarkerBase extends RectangularBoxMarkerBase {
  public static title = 'Image marker';

  /**
   * Main SVG or image element of the stencil.
   */
  protected SVGImage?: SVGSVGElement | SVGImageElement;
  protected imageType: ImageType = 'svg';

  protected _svgString?: string;
  public get svgString() {
    return this._svgString;
  }
  public set svgString(value) {
    this._svgString = value;
    if (this.SVGImage && this.imageType === 'svg') {
      if (value !== undefined) {
        this.SVGImage.outerHTML = value;
      } else {
        this.SVGImage.outerHTML = '';
      }
    }
  }

  protected _imageSrc?: string; // = 'data:image/png;base64,...';
  public get imageSrc() {
    return this._imageSrc;
  }
  public set imageSrc(value) {
    this._imageSrc = value;
    if (this.SVGImage && this.imageType === 'bitmap') {
      if (value !== undefined) {
        SvgHelper.setAttributes(this.SVGImage, [['href', value]]);
      } else {
        SvgHelper.setAttributes(this.SVGImage, [['href', '']]);
      }
    }
  }

  /**
   * Natural (real) width of the image.
   */
  protected naturalWidth = 24;
  /**
   * Natural (real) height of the image.
   */
  protected naturalHeight = 24;

  constructor(container: SVGGElement) {
    super(container);

    this.defaultSize = { width: this.naturalWidth, height: this.naturalHeight };

    this.createImage = this.createImage.bind(this);
    this.createVisual = this.createVisual.bind(this);
  }

  protected createImage(): void {
    if (this._svgString !== undefined) {
      this.imageType = 'svg';
      // Import into current document to avoid cross-document issues
      const parser = new DOMParser();
      const doc = parser.parseFromString(this._svgString, 'image/svg+xml');
      const element = doc.documentElement;
      if (!(element instanceof SVGSVGElement)) {
        throw new Error('Invalid SVG string');
      }
      const svgElement = element;
      this.SVGImage = this.container.ownerDocument.importNode(svgElement, true);
    } else {
      this.imageType = 'bitmap';
      this.SVGImage = SvgHelper.createImage([['href', this._imageSrc ?? '']]);
    }
  }

  public createVisual(): void {
    this.createImage();
    if (this.SVGImage !== undefined) {
      this.visual = SvgHelper.createGroup();

      if (this.imageType === 'svg') {
        SvgHelper.setAttributes(this.visual, [
          ['viewBox', `0 0 ${this.naturalWidth} ${this.naturalHeight}`],
          ['fill', this._fillColor],
          ['stroke', this._strokeColor],
          ['stroke-width', this.strokeWidth.toString()],
          ['stroke-dasharray', this.strokeDasharray],
          ['pointer-events', 'bounding-box'],
        ]);
        // } else if (this.imageType === 'bitmap') {
      }
      this.adjustImage();
      this.visual.appendChild(this.SVGImage);
      this.addMarkerVisualToContainer(this.visual);
    }
  }

  public adjustImage(): void {
    if (this.SVGImage !== undefined) {
      this.SVGImage.setAttribute('x', `0px`);
      this.SVGImage.setAttribute('y', `0px`);
      this.SVGImage.setAttribute('width', `${this.width}px`);
      this.SVGImage.setAttribute('height', `${this.height}px`);
    }
  }

  private isDescendant(parent: Element, target: EventTarget): boolean {
    if (parent === target) {
      return true;
    }

    for (let i = 0; i < parent.children.length; i++) {
      if (this.isDescendant(parent.children[i], target)) {
        return true;
      }
    }
    return false;
  }

  public ownsTarget(el: EventTarget): boolean {
    return (
      super.ownsTarget(el) ||
      (this.SVGImage !== undefined && this.isDescendant(this.SVGImage, el))
    );
  }

  public setSize(): void {
    super.setSize();
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [
        ['width', `${this.width}px`],
        ['height', `${this.height}px`],
      ]);
      this.adjustImage();
    }
  }

  public getState(): ImageMarkerBaseState {
    const result: ImageMarkerBaseState = Object.assign(
      {
        imageType: this.imageType,
        svgString: this.svgString,
        imageSrc: this.imageSrc,
      },
      super.getState(),
    );

    return result;
  }

  public restoreState(state: ImageMarkerBaseState): void {
    const imgState = state as ImageMarkerBaseState;
    if (imgState.imageType !== undefined) {
      this.imageType = imgState.imageType;
    }
    if (imgState.svgString !== undefined) {
      this._svgString = imgState.svgString;
    }
    if (imgState.imageSrc !== undefined) {
      this._imageSrc = imgState.imageSrc;
    }
    this.createVisual();
    super.restoreState(state);
    this.setSize();
  }

  /**
   * Scales marker. Used after the image resize.
   *
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    this.setSize();
  }
}
