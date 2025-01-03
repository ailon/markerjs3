import { CaptionFrameMarker } from '../core';
import { MarkerEditorProperties } from './MarkerEditorProperties';
import { TextMarkerEditor } from './TextMarkerEditor';

export class CaptionFrameMarkerEditor<
  TMarkerType extends CaptionFrameMarker = CaptionFrameMarker,
> extends TextMarkerEditor<TMarkerType> {
  constructor(properties: MarkerEditorProperties<TMarkerType>) {
    super(properties);

    this.disabledResizeGrips = [];
    this._creationStyle = 'draw';
  }

  protected setSize(): void {
    super.setSize();
    this.textBlockEditorContainer.style.transform = `translate(${
      this.marker.left
    }px, ${this.marker.top + this.marker.strokeWidth / 2}px)`;
    if (this.marker.textBlock.textSize) {
      const height =
        this.marker.textBlock.textSize.height + this.marker.padding * 2;
      this.textBlockEditorContainer.style.width = `${this.marker.width}px`;
      this.textBlockEditorContainer.style.height = `${height}px`;
      this.textBlockEditor.width = this.marker.width;
      this.textBlockEditor.height = height;
    }
  }
}
