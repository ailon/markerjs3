/**
 * Text changed event handler type.
 */
export type TextChangedHandler = (text: string) => void;

export type BlurHandler = () => void;

/**
 * Represents a text block editor element.
 */
export class TextBlockEditor {
  private textEditor: HTMLDivElement;
  private isInFocus = false;

  private _width = 0;
  /**
   * Returns editor width in pixels.
   */
  public get width() {
    return this._width;
  }
  /**
   * Sets editor width in pixels.
   */
  public set width(value) {
    this._width = value;
    this.textEditor.style.width = `${this.width}px`;
  }

  private _height = 0;
  /**
   * Returns editor height in pixels.
   */
  public get height() {
    return this._height;
  }
  /**
   * Sets editor height in pixels.
   */
  public set height(value) {
    this._height = value;
    this.textEditor.style.height = `${this.height}px`;
  }

  private _left = 0;
  /**
   * Returns the horizontal (X) location of the editor's left corner (in pixels).
   */
  public get left() {
    return this._left;
  }
  /**
   * Sets the horizontal (X) location of the editor's left corner (in pixels).
   */
  public set left(value) {
    this._left = value;
    this.textEditor.style.left = `${this.left}px`;
  }

  private _top = 0;
  /**
   * Returns the vertical (Y) location of the editor's top left corner (in pixels).
   */
  public get top() {
    return this._top;
  }
  /**
   * Sets the vertical (Y) location of the editor's top left corner (in pixels).
   */
  public set top(value) {
    this._top = value;
    this.textEditor.style.top = `${this.top}px`;
  }

  private _text = '';
  /**
   * Returns the text block text.
   */
  public get text() {
    return this._text;
  }
  /**
   * Sets the text block text.
   */
  public set text(value) {
    this._text = value;
  }

  private _fontFamily = 'sans-serif';
  /**
   * Returns text block's font family.
   */
  public get fontFamily() {
    return this._fontFamily;
  }
  /**
   * Sets the text block's font family.
   */
  public set fontFamily(value) {
    this._fontFamily = value;
    this.textEditor.style.fontFamily = this._fontFamily;
  }

  private _fontSize = '1rem';
  /**
   * Returns text block's font size.
   */
  public get fontSize() {
    return this._fontSize;
  }
  /**
   * Sets text block's font size.
   */
  public set fontSize(value) {
    this._fontSize = value;
    this.textEditor.style.fontSize = this._fontSize;
  }

  private _textColor = '#000';
  /**
   * Returns text block's font color.
   */
  public get textColor() {
    return this._textColor;
  }
  /**
   * Returns text block's font color.
   */
  public set textColor(value) {
    this._textColor = value;
    this.textEditor.style.color = this.textColor;
  }

  private _bgColor = 'transparent';
  public get bgColor() {
    return this._bgColor;
  }
  public set bgColor(value) {
    this._bgColor = value;
    this.textEditor.style.backgroundColor = this.bgColor;
  }

  /**
   * Text changed event handler.
   */
  public onTextChanged?: TextChangedHandler;

  public onBlur?: BlurHandler;

  /**
   * Creates a new text block editor instance.
   */
  constructor() {
    this.textEditor = document.createElement('div');

    this.getEditorUi = this.getEditorUi.bind(this);
    this.focus = this.focus.bind(this);
    this.setup = this.setup.bind(this);
  }

  private isSetupCompleted = false;
  private setup() {
    // this.textEditor.style.position = 'absolute';
    this.textEditor.style.pointerEvents = 'auto';
    this.textEditor.style.display = 'flex';
    this.textEditor.style.flexDirection = 'column';
    this.textEditor.style.alignItems = 'center';
    this.textEditor.style.justifyContent = 'center';
    this.textEditor.style.width = `${this._width}px`;
    this.textEditor.style.height = `${this._height}px`;
    this.textEditor.style.overflow = 'hidden';
    this.textEditor.style.textAlign = 'center';
    this.textEditor.style.fontFamily = this._fontFamily;
    this.textEditor.style.fontSize = this._fontSize;
    this.textEditor.style.lineHeight = '1em';
    if (this._text !== '') {
      this.textEditor.innerText = this._text;
    } else {
      this.textEditor.innerHTML = '&nbsp;';
    }
    this.textEditor.contentEditable = 'true';
    this.textEditor.style.outline = 'none';
    this.textEditor.style.color = this._textColor;
    this.textEditor.style.whiteSpace = 'pre';
    this.textEditor.addEventListener('pointerdown', (ev) => {
      ev.stopPropagation();
    });
    this.textEditor.addEventListener('pointerup', (ev) => {
      ev.stopPropagation();
    });
    this.textEditor.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        this.textEditor.blur();
      }
    });
    this.textEditor.addEventListener('keyup', (ev) => {
      ev.cancelBubble = true;
      this._text = this.textEditor.innerText;
      if (this.onTextChanged !== undefined) {
        this.onTextChanged(this._text);
      }
    });
    this.textEditor.addEventListener('blur', () => {
      this._text = this.textEditor.innerText;
      if (this.onTextChanged !== undefined) {
        this.onTextChanged(this._text);
      }
      if (this.onBlur !== undefined) {
        this.onBlur();
      }
    });
    this.textEditor.addEventListener('paste', (ev) => {
      if (ev.clipboardData) {
        // paste plain text
        const content = ev.clipboardData.getData('text');
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return false;
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(content));
        ev.preventDefault();
      }
    });

    this.isSetupCompleted = true;
  }

  /**
   * Returns editor's UI,
   * @returns UI in a div element.
   */
  public getEditorUi(): HTMLDivElement {
    if (!this.isSetupCompleted) {
      this.setup();
    }

    return this.textEditor;
  }

  /**
   * Focuses text editing in the editor.
   */
  public focus() {
    this.textEditor.focus();

    // position cursor at the end of the text
    const range = document.createRange();
    range.selectNodeContents(this.textEditor);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
  /**
   * Unfocuses the editor.
   */
  public blur() {
    this.textEditor.blur();
  }
}
