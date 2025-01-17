import { CaptionFrameMarkerState } from './CaptionFrameMarkerState';
import { MarkerBaseState } from './MarkerBaseState';
import { SvgHelper } from './SvgHelper';
import { TextMarker } from './TextMarker';

/**
 * Caption frame marker is a combination of a frame (rectangle) and a text caption that goes with it.
 *
 * @summary A combination of a frame (rectangle) and a text caption that goes with it.
 *
 * @group Markers
 */
export class CaptionFrameMarker extends TextMarker {
  public static typeName = 'CaptionFrameMarker';

  public static title = 'Caption frame marker';

  private _outerFrameVisual: SVGPathElement = SvgHelper.createPath('M0,0');
  private _captionFrameVisual: SVGPathElement = SvgHelper.createPath('M0,0');
  private _frameVisual: SVGGElement = SvgHelper.createGroup();

  constructor(container: SVGGElement) {
    super(container);

    this.color = '#ffffff';
    this.fillColor = '#ff0000';
    this.strokeColor = '#ff0000';
    this.strokeWidth = 3;
    this.padding = 5;

    this.createVisual = this.createVisual.bind(this);
    this.adjustVisual = this.adjustVisual.bind(this);
    this.adjustFrameVisual = this.adjustFrameVisual.bind(this);
    this.getPaths = this.getPaths.bind(this);
  }

  protected applyStrokeColor() {
    SvgHelper.setAttributes(this._outerFrameVisual, [
      ['stroke', this._strokeColor],
    ]);
    SvgHelper.setAttributes(this._captionFrameVisual, [
      ['stroke', this._strokeColor],
    ]);
  }

  protected applyStrokeWidth() {
    SvgHelper.setAttributes(this._outerFrameVisual, [
      ['stroke-width', this._strokeWidth.toString()],
    ]);
    SvgHelper.setAttributes(this._captionFrameVisual, [
      ['stroke-width', this._strokeWidth.toString()],
    ]);
    this.adjustTextPosition();
    this.adjustFrameVisual();
  }

  protected applyStrokeDasharray() {
    SvgHelper.setAttributes(this._outerFrameVisual, [
      ['stroke-dasharray', this._strokeDasharray],
    ]);
    SvgHelper.setAttributes(this._captionFrameVisual, [
      ['stroke-dasharray', this._strokeDasharray],
    ]);
  }

  protected applyOpacity() {
    SvgHelper.setAttributes(this._outerFrameVisual, [
      ['opacity', this._opacity.toString()],
    ]);
    SvgHelper.setAttributes(this._captionFrameVisual, [
      ['opacity', this._opacity.toString()],
    ]);
  }

  protected applyFillColor() {
    SvgHelper.setAttributes(this._captionFrameVisual, [
      ['fill', this._fillColor],
    ]);
  }

  /**
   * Returns the SVG path strings for the frame and the caption background.
   *
   * @param width
   * @param height
   * @returns SVG path strings for the frame and the caption background.
   */
  protected getPaths(
    width: number = this.width,
    height: number = this.height,
  ): { frame: string; caption: string } {
    const titleHeight =
      (this.textBlock.textSize?.height ?? 40) +
      this.padding * 2 +
      this.strokeWidth;
    return {
      frame: `M 0 0
      V ${height}
      H ${width}
      V 0
      Z`,
      caption: `M 0 0
      H ${width}
      V ${titleHeight}
      H 0
      Z`,
    };
  }

  public createVisual(): void {
    super.createVisual();

    const paths = this.getPaths();

    this._outerFrameVisual = SvgHelper.createPath(paths.frame, [
      ['fill', 'transparent'],
      ['stroke', this._strokeColor],
      ['stroke-width', this._strokeWidth.toString()],
      ['stroke-dasharray', this._strokeDasharray],
      ['opacity', this._opacity.toString()],
    ]);
    this._captionFrameVisual = SvgHelper.createPath(paths.caption, [
      ['fill', 'this._fillColor'],
      ['fill-rule', 'evenodd'],
      ['stroke', this._strokeColor],
      ['stroke-width', this._strokeWidth.toString()],
      ['stroke-dasharray', this._strokeDasharray],
      ['opacity', this._opacity.toString()],
    ]);
    this._frameVisual.appendChild(this._outerFrameVisual);
    this._frameVisual.appendChild(this._captionFrameVisual);
    this.visual?.insertBefore(this._frameVisual, this.textBlock.textElement);
  }

  public adjustVisual(): void {
    super.adjustVisual();

    this.adjustTextPosition();
    this.adjustFrameVisual();
  }

  /**
   * Adjusts text position inside the caption frame.
   */
  protected adjustTextPosition(): void {
    if (this.textBlock.textSize) {
      this.textBlock.textElement.style.transform = `translate(${
        this.width / 2 - this.textBlock.textSize?.width / 2 - this.padding
      }px, ${this.strokeWidth / 2}px)`;
    }
  }

  /**
   * Adjusts frame visual according to the current marker properties.
   */
  protected adjustFrameVisual(): void {
    const paths = this.getPaths();
    if (this._outerFrameVisual) {
      SvgHelper.setAttributes(this._outerFrameVisual, [
        ['d', paths.frame],
        ['stroke', this._strokeColor],
        ['stroke-width', this._strokeWidth.toString()],
        ['stroke-dasharray', this._strokeDasharray],
        ['opacity', this._opacity.toString()],
      ]);
    }
    if (this._captionFrameVisual) {
      SvgHelper.setAttributes(this._captionFrameVisual, [
        ['d', paths.caption],
        ['fill', this._fillColor],
        ['stroke', this._strokeColor],
        ['stroke-width', this._strokeWidth.toString()],
        ['stroke-dasharray', this._strokeDasharray],
        ['opacity', this._opacity.toString()],
      ]);
    }
  }

  public ownsTarget(el: EventTarget): boolean {
    if (
      super.ownsTarget(el) ||
      this._outerFrameVisual === el ||
      this._captionFrameVisual === el
    ) {
      return true;
    } else {
      return false;
    }
  }

  public setSize(): void {
    super.setSize();
    this.adjustTextPosition();
    this.adjustFrameVisual();
  }
  protected setSizeFromTextSize(): void {}

  /**
   * Hides the marker visual.
   *
   * Used by the editor to hide rendered marker while editing the text.
   */
  public hideVisual(): void {
    this.textBlock.hide();
  }
  /**
   * Shows the marker visual.
   *
   * Used by the editor to show rendered marker after editing the text.
   */
  public showVisual() {
    this.textBlock.show();
    this.textBlock.renderText();
  }

  public getState(): CaptionFrameMarkerState {
    const result: CaptionFrameMarkerState = Object.assign(
      {
        fillColor: this.fillColor,
      },
      super.getState(),
    );

    return result;
  }

  public restoreState(state: MarkerBaseState): void {
    const captionState = state as CaptionFrameMarkerState;
    super.restoreState(state);
    this.fillColor = captionState.fillColor;

    this.adjustVisual();
  }

  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    this.strokeWidth *= (scaleX + scaleY) / 2;

    this.setSize();
  }
}
