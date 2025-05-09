import { FontSize } from './FontSize';
import { MarkerBaseState } from './MarkerBaseState';
import { RectangularBoxMarkerBase } from './RectangularBoxMarkerBase';
import { SvgHelper } from './SvgHelper';
import { TextBlock } from './TextBlock';
import { TextMarkerState } from './TextMarkerState';

/**
 * Text marker.
 *
 * Used to represent a text block as well a base class for other text-based markers.
 *
 * @summary Text marker.
 * @group Markers
 */
export class TextMarker extends RectangularBoxMarkerBase {
  public static typeName = 'TextMarker';

  public static title = 'Text marker';

  /**
   * Default text for the marker type.
   */
  protected static DEFAULT_TEXT = 'Text';
  // protected static DEFAULT_TEXT =
  //   'Longer text to see what happens when it is too long to fit the bounding box.';

  /**
   * Callback to be called when the text size changes.
   */
  public onSizeChanged?: (textMarker: TextMarker) => void;

  private _color = 'black';
  /**
   * Returns markers's text color.
   */
  public get color() {
    return this._color;
  }
  /**
   * Sets the markers's text color.
   */
  public set color(value) {
    this._color = value;
    this.textBlock.color = value;
  }

  private _fontFamily = 'Helvetica, Arial, sans-serif';
  /**
   * Returns the markers's font family.
   */
  public get fontFamily() {
    return this._fontFamily;
  }
  /**
   * Sets the markers's font family.
   */
  public set fontFamily(value) {
    this._fontFamily = value;
    this.textBlock.fontFamily = value;
  }

  private _fontSize: FontSize = {
    value: 1,
    units: 'rem',
    step: 0.1,
  };
  /**
   * Returns the marker's font size.
   */
  public get fontSize(): FontSize {
    return this._fontSize;
  }
  /**
   * Sets the marker's font size.
   */
  public set fontSize(value: FontSize) {
    this._fontSize = value;
    this.textBlock.fontSize = value;
  }

  /**
   * Returns the default text for the marker type.
   * @returns marker type's default text.
   */
  protected getDefaultText(): string {
    return Object.getPrototypeOf(this).constructor.DEFAULT_TEXT;
  }
  private _text: string = this.getDefaultText();
  /**
   * Returns the marker's text.
   */
  public get text(): string {
    return this.textBlock.text;
  }
  /**
   * Sets the marker's text.
   */
  public set text(value: string) {
    this._text = value;
    this.textBlock.text = this._text;
  }

  /**
   * Text padding from the bounding box.
   */
  public padding = 2;

  /**
   * Text's bounding box where text should fit and/or be anchored to.
   */
  public textBoundingBox: DOMRect;

  /**
   * Text block handling the text rendering.
   */
  public textBlock: TextBlock = new TextBlock(this.getDefaultText());

  constructor(container: SVGGElement) {
    super(container);

    this.setColor = this.setColor.bind(this);
    this.setFont = this.setFont.bind(this);
    this.setFontSize = this.setFontSize.bind(this);
    this.setSize = this.setSize.bind(this);
    this.textSizeChanged = this.textSizeChanged.bind(this);
    this.setSizeFromTextSize = this.setSizeFromTextSize.bind(this);

    this.createVisual = this.createVisual.bind(this);
    this.adjustVisual = this.adjustVisual.bind(this);

    this.textBoundingBox = new DOMRect();
  }

  protected applyOpacity() {
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [
        ['opacity', this.opacity.toString()],
      ]);
    }
  }

  /**
   * Creates marker's visual.
   */
  public createVisual(): void {
    this.textBlock.fontFamily = this.fontFamily;
    this.textBlock.fontSize = this.fontSize;
    this.textBlock.color = this.color;
    this.textBlock.offsetX = this.padding;
    this.textBlock.offsetY = this.padding;

    this.textBlock.onTextSizeChanged = this.textSizeChanged;

    this.visual = SvgHelper.createGroup();
    SvgHelper.setAttributes(this.visual, [
      ['opacity', this._opacity.toString()],
    ]);
    this.visual.appendChild(this.textBlock.textElement);
    this.addMarkerVisualToContainer(this.visual);

    this.textBlock.text = this._text;
  }

  /**
   * Adjusts marker's visual according to the current state.
   */
  public adjustVisual(): void {
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [
        ['opacity', this._opacity.toString()],
      ]);
    }
    this.setSize();
  }

  public ownsTarget(el: EventTarget): boolean {
    if (
      super.ownsTarget(el) ||
      el === this.visual ||
      this.textBlock.ownsTarget(el)
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Sets the text bounding box.
   */
  protected setTextBoundingBox() {
    this.textBoundingBox.x = this.padding;
    this.textBoundingBox.y = this.padding;
    this.textBoundingBox.width = Number.MAX_VALUE; // this.width - this.padding * 2;
    this.textBoundingBox.height = Number.MAX_VALUE; // this.height - this.padding * 2;
    //this.textBlock.boundingBox = this.textBoundingBox;
  }

  /**
   * Sets (adjusts) the marker's size.
   */
  public setSize(): void {
    const [prevWidth, prevHeight] = [this.width, this.height];

    super.setSize();
    this.setSizeFromTextSize();

    if (
      (prevWidth !== this.width || prevHeight !== this.height) &&
      this.onSizeChanged
    ) {
      this.onSizeChanged(this);
    }

    this.setTextBoundingBox();
  }

  /**
   * Sets the marker's size based on the text size.
   */
  protected setSizeFromTextSize(): void {
    if (this.textBlock.textSize) {
      this.width = this.textBlock.textSize.width + this.padding * 2;
      this.height = this.textBlock.textSize.height + this.padding * 2;
    }

    this.textBlock.offsetX = this.padding;
    this.textBlock.offsetY = this.padding;
  }

  private textSizeChanged(): void {
    this.adjustVisual();
  }

  /**
   * Sets the text color.
   * @param color text color
   */
  public setColor(color: string): void {
    this.color = color;
  }

  /**
   * Sets the font family.
   * @param font font family string
   */
  public setFont(font: string): void {
    this.fontFamily = font;
  }

  /**
   * Sets the font size.
   * @param fontSize font size
   */
  public setFontSize(fontSize: FontSize): void {
    this.fontSize = fontSize;
  }

  /**
   * Hides the marker's visual.
   *
   * Used when editing the text.
   */
  public hideVisual(): void {
    if (this.visual) {
      this.visual.style.visibility = 'hidden';
    }
  }
  /**
   * Shows the marker's visual.
   *
   * Eg. when done editing the text.
   */
  public showVisual() {
    if (this.visual) {
      this.visual.style.visibility = 'visible';
      this.textBlock.renderText();
    }
  }

  public getState(): TextMarkerState {
    const result: TextMarkerState = Object.assign(
      {
        color: this.color,
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
        text: this.text,
        padding: this.padding,
      },
      super.getState(),
    );
    return result;
  }

  public restoreState(state: MarkerBaseState): void {
    const textState = state as TextMarkerState;
    this.color = textState.color;
    this.fontFamily = textState.fontFamily;
    this.fontSize = textState.fontSize;
    this.text = textState.text;
    if (textState.padding !== undefined) {
      this.padding = textState.padding;
    }

    this.createVisual();

    super.restoreState(state);
    this.adjustVisual();
  }

  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    const newFontSize = {
      ...this.fontSize,
      value: this.fontSize.value * Math.min(scaleX, scaleY),
    };
    this.fontSize = newFontSize;

    this.padding = this.padding * Math.min(scaleX, scaleY);

    this.adjustVisual();
  }
}
