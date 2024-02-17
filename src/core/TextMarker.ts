import { FontSize } from './FontSize';
import { RectangularBoxMarkerBase } from './RectangularBoxMarkerBase';
import { TextBlock } from './TextBlock';

export class TextMarker extends RectangularBoxMarkerBase {
  public static typeName = 'TextMarker';

  public static title = 'Text marker';

  // protected static DEFAULT_TEXT = 'Text';
  protected static DEFAULT_TEXT = 'Longer text to see what happens when it is too long to fit the bounding box.';

  private _color = 'black';
  /**
   * Returns stencil's text color.
   */
  public get color() {
    return this._color;
  }
  /**
   * Sets the stencil's text color.
   */
  public set color(value) {
    this._color = value;
    this.textBlock.color = value;
  }

  private _fontFamily = 'Helvetica, Arial, sans-serif';
  /**
   * Returns the stencil's font family.
   */
  public get fontFamily() {
    return this._fontFamily;
  }
  /**
   * Sets the stencil's font family.
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
   * Returns the stencil's font size.
   */
  public get fontSize(): FontSize {
    return this._fontSize;
  }
  /**
   * Sets the stencil's font size.
   */
  public set fontSize(value: FontSize) {
    this._fontSize = value;
    this.textBlock.fontSize = value;
  }

  /**
   * Returns the default text for the stencil type.
   * @returns stencil type's default text.
   */
  protected getDefaultText(): string {
    return Object.getPrototypeOf(this).constructor.DEFAULT_TEXT;
  }
  private _text: string = this.getDefaultText();
  /**
   * Returns the stencil's text.
   */
  public get text(): string {
    return this.textBlock.text;
  }
  /**
   * Sets the stencil's text.
   */
  public set text(value: string) {
    this._text = value;
    this.textBlock.text = this._text;
  }

  /**
   * Text padding from the bounding box.
   */
  protected padding = 2;

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

    this.createVisual = this.createVisual.bind(this);

    this.textBoundingBox = new DOMRect();
  }

  public createVisual(): void {
    this.textBlock.fontFamily = this.fontFamily;
    this.textBlock.fontSize = this.fontSize;
    this.textBlock.color = this.color;
    this.textBlock.onTextSizeChanged = this.setSize;

    this.visual = this.textBlock.textElement;
    this.addMarkerVisualToContainer(this.visual);
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

  protected setTextBoundingBox() {
    this.textBoundingBox.x = this.padding;
    this.textBoundingBox.y = this.padding;
    this.textBoundingBox.width = Number.MAX_VALUE; // this.width - this.padding * 2;
    this.textBoundingBox.height = Number.MAX_VALUE; // this.height - this.padding * 2;
    this.textBlock.boundingBox = this.textBoundingBox;
  }

  /**
   * Sets (adjusts) the stencil's size.
   */
  public setSize(): void {
    super.setSize();
    
    if (this.textBlock.textSize) {
      this.width = this.textBlock.textSize.width + this.padding * 2;
      this.height = this.textBlock.textSize.height + this.padding * 2;
    }

    this.setTextBoundingBox();
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
}
