import { ImageMarkerBaseState, ImageType } from './ImageMarkerBaseState';
import { RectangularBoxMarkerBase } from './RectangularBoxMarkerBase';
import { SvgHelper } from './SvgHelper';

export class ImageMarkerBase extends RectangularBoxMarkerBase {
  public static title = 'Image marker';

  /**
   * Inner SVG string content of an SVG image (w/o the SVG tags).
   */
  protected static svgString?: string;

  /**
   * Main SVG or image element of the stencil.
   */
  protected SVGImage?: SVGSVGElement | SVGImageElement;
  protected imageType: ImageType = 'svg';
  protected _imageSrc?: string; // = 'data:image/png;base64,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';
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
    if (Object.getPrototypeOf(this).constructor.svgString !== undefined) {
      this.imageType = 'svg';
      this.SVGImage = SvgHelper.createSvgFromString(
        Object.getPrototypeOf(this).constructor.svgString,
      );
    } else {
      this.imageType = 'bitmap';
      this.SVGImage = SvgHelper.createImage([['href', this._imageSrc ?? '']]);
    }
  }

  public createVisual(): void {
    this.createImage();
    if (this.SVGImage !== undefined) {
      if (this.imageType === 'svg') {
        SvgHelper.setAttributes(this.SVGImage, [
          ['viewBox', `0 0 ${this.naturalWidth} ${this.naturalHeight}`],
          ['pointer-events', 'none'],
          ['fill', this._fillColor],
          ['stroke', this._strokeColor],
          ['stroke-width', this.strokeWidth.toString()],
          ['stroke-dasharray', this.strokeDasharray],
        ]);
        // } else if (this.imageType === 'bitmap') {
      }
      this.adjustImage();
      this.visual = this.SVGImage;
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

  public ownsTarget(el: EventTarget): boolean {
    return super.ownsTarget(el) || el === this.SVGImage;
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
    if (imgState.imageSrc !== undefined) {
      this.imageSrc = imgState.imageSrc;
    }
    this.createVisual();
    super.restoreState(state);
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
