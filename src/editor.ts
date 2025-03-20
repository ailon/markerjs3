/**
 * @module Editor
 * @category API Reference
 */
import { MarkerArea } from './MarkerArea';

export {
  MarkerArea,
  MarkerAreaEventData,
  MarkerEditorEventData,
  MarkerAreaMode,
  MarkerAreaEventMap,
} from './MarkerArea';
export {
  MarkerBaseEditor,
  MarkerEditorState,
  MarkerCreationStyle,
} from './editor/MarkerBaseEditor';
export { MarkerEditorProperties } from './editor/MarkerEditorProperties';
export { Grip, GripLocation } from './editor/Grip';
export { ResizeGrip } from './editor/ResizeGrip';
export { RotateGrip } from './editor/RotateGrip';
export { ShapeOutlineMarkerEditor } from './editor/ShapeOutlineMarkerEditor';
export { ShapeMarkerEditor } from './editor/ShapeMarkerEditor';
export { LinearMarkerEditor } from './editor/LinearMarkerEditor';
export { PolygonMarkerEditor } from './editor/PolygonMarkerEditor';
export { FreehandMarkerEditor } from './editor/FreehandMarkerEditor';
export {
  TextBlockEditor,
  BlurHandler,
  TextChangedHandler,
} from './editor/TextBlockEditor';
export { TextMarkerEditor } from './editor/TextMarkerEditor';
export { ArrowMarkerEditor } from './editor/ArrowMarkerEditor';
export { CalloutMarkerEditor } from './editor/CalloutMarkerEditor';
export { ImageMarkerEditor } from './editor/ImageMarkerEditor';
export { CaptionFrameMarkerEditor } from './editor/CaptionFrameMarkerEditor';
export { CurveMarkerEditor } from './editor/CurveMarkerEditor';

if (
  window &&
  window.customElements &&
  window.customElements.get('mjs-marker-area') === undefined
) {
  window.customElements.define('mjs-marker-area', MarkerArea);
}
