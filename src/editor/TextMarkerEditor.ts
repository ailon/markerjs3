import { FontSize, IPoint, SvgHelper, TextMarker } from '../core';
import { MarkerEditorProperties } from './MarkerEditorProperties';
import { RectangularBoxMarkerBaseEditor } from './RectangularBoxMarkerBaseEditor';
import { TextBlockEditor } from './TextBlockEditor';

/**
 * Editor for text markers.
 *
 * @summary Text marker editor.
 * @group Editors
 */
export class TextMarkerEditor<
  TMarkerType extends TextMarker = TextMarker,
> extends RectangularBoxMarkerBaseEditor<TMarkerType> {
  /**
   * Container for text block editor.
   */
  protected textBlockEditorContainer: SVGForeignObjectElement =
    SvgHelper.createForeignObject();
  /**
   * Text block editor.
   */
  protected textBlockEditor: TextBlockEditor;

  /**
   * Text color.
   */
  public set color(color: string) {
    this.marker.color = color;
    this.stateChanged();
  }
  /**
   * Text color.
   */
  public get color(): string {
    return this.marker.color;
  }

  /**
   * Sets text's font family.
   */
  public set fontFamily(font: string) {
    this.marker.fontFamily = font;
    this.stateChanged();
  }
  /**
   * Returns text's font family.
   */
  public get fontFamily(): string {
    return this.marker.fontFamily;
  }

  /**
   * Sets text's font size.
   */
  public set fontSize(size: FontSize) {
    this.marker.fontSize = size;
    this.stateChanged();
  }
  /**
   * Returns text's font size.
   */
  public get fontSize(): FontSize {
    return this.marker.fontSize;
  }

  constructor(properties: MarkerEditorProperties<TMarkerType>) {
    super(properties);

    this.disabledResizeGrips = [
      'topleft',
      'topcenter',
      'topright',
      'bottomleft',
      'bottomcenter',
      'bottomright',
      'leftcenter',
      'rightcenter',
    ];

    this._creationStyle = 'drop';

    this.textBlockEditor = new TextBlockEditor();
    this.marker.onSizeChanged = this.markerSizeChanged;

    this.showEditor = this.showEditor.bind(this);
    this.hideEditor = this.hideEditor.bind(this);
    this.pointerDown = this.pointerDown.bind(this);
    this.pointerUp = this.pointerUp.bind(this);
    this.resize = this.resize.bind(this);
    this.markerSizeChanged = this.markerSizeChanged.bind(this);
  }

  private _pointerDownTime: number = Number.MAX_VALUE;
  private _pointerDownPoint: IPoint = { x: 0, y: 0 };

  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);

    this._pointerDownTime = Date.now();
    this._pointerDownPoint = point;

    if (this.state === 'new') {
      this.marker.createVisual();

      this.marker.moveVisual(point);

      this._state = 'creating';
    }
  }

  public dblClick(point: IPoint, target?: EventTarget): void {
    super.dblClick(point, target);
    if (this.state !== 'edit') {
      this.showEditor();
    }
  }

  protected setSize(): void {
    super.setSize();
    this.textBlockEditorContainer.style.transform = `translate(${this.marker.left}px, ${this.marker.top}px)`;
    this.textBlockEditorContainer.style.width = `${this.marker.width}px`;
    this.textBlockEditorContainer.setAttribute('width', `${this.marker.width}`);
    this.textBlockEditorContainer.style.height = `${this.marker.height}px`;
    this.textBlockEditorContainer.setAttribute(
      'height',
      `${this.marker.height}`,
    );
    this.textBlockEditor.width = this.marker.width;
    this.textBlockEditor.height = this.marker.height;
  }

  protected resize(point: IPoint): void {
    super.resize(point);
    this.setSize();
  }

  public pointerUp(point: IPoint): void {
    const inState = this.state;
    super.pointerUp(point);
    this.setSize();

    if (
      inState === 'creating' ||
      (Date.now() - this._pointerDownTime > 500 &&
        Math.abs(this._pointerDownPoint.x - point.x) < 5 &&
        Math.abs(this._pointerDownPoint.y - point.y) < 5)
    ) {
      this.showEditor();
    }

    this.adjustControlBox();
  }

  private showEditor(): void {
    this.textBlockEditor.text = this.marker.text;
    this.textBlockEditor.textColor = this.marker.color;
    this.textBlockEditor.bgColor = this.marker.fillColor;
    this.textBlockEditor.fontFamily = this.marker.fontFamily;
    this.textBlockEditor.fontSize = `${this.marker.fontSize.value}${this.marker.fontSize.units}`;

    if (this.textBlockEditor.onTextChanged === undefined) {
      this.textBlockEditor.onTextChanged = (text: string) => {
        this.marker.text = text;
      };
    }
    if (this.textBlockEditor.onBlur === undefined) {
      this.textBlockEditor.onBlur = () => {
        this.hideEditor();
        this.deselect();
      };
    }
    this.textBlockEditorContainer.appendChild(
      this.textBlockEditor.getEditorUi(),
    );
    this.container.appendChild(this.textBlockEditorContainer);

    this.marker.hideVisual();
    this.hideControlBox();

    this.textBlockEditor.focus();
  }

  private hideEditor(): void {
    this.marker.text = this.textBlockEditor.text;
    this.marker.showVisual();
    this.showControlBox();
    this.state = 'select';
    this.container.removeChild(this.textBlockEditorContainer);
  }

  private markerSizeChanged = () => {
    this.setSize();
  };
}
