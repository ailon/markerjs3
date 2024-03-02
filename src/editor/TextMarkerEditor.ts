import { IPoint, SvgHelper } from '../core';
import { TextMarker } from '../core/TextMarker';
import { MarkerEditorProperties } from './MarkerEditorProperties';
import { RectangularBoxMarkerBaseEditor } from './RectangularBoxMarkerBaseEditor';
import { TextBlockEditor } from './TextBlockEditor';

export class TextMarkerEditor<
  TMarkerType extends TextMarker = TextMarker,
> extends RectangularBoxMarkerBaseEditor<TMarkerType> {

  private textBlockEditorContainer: SVGForeignObjectElement = SvgHelper.createForeignObject();
  ;
  private textBlockEditor: TextBlockEditor;

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
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) down event.
   *
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);
    if (this.state === 'new') {
      this.marker.createVisual();

      this.marker.moveVisual(point);

      this._state = 'creating';
    }
  }

  protected setSize(): void {
    super.setSize();
    this.textBlockEditorContainer.style.transform = `translate(${this.marker.left}px, ${this.marker.top}px)`;
    this.textBlockEditorContainer.style.width = `${this.marker.width}px`;
    this.textBlockEditorContainer.style.height = `${this.marker.height}px`;
    this.textBlockEditor.width = this.marker.width;
    this.textBlockEditor.height = this.marker.height;
  }

  /**
   * Resizes the marker based on the pointer coordinates.
   * @param point - current pointer coordinates.
   */
  protected resize(point: IPoint): void {
    super.resize(point);
    this.setSize();
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   *
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
    this.setSize();

    this.textBlockEditor.text = this.marker.text;
    this.textBlockEditorContainer.appendChild(this.textBlockEditor.getEditorUi());
    this.container.appendChild(this.textBlockEditorContainer);      

    this.adjustControlBox();
  }
}
