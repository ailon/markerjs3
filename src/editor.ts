import { MarkerArea } from './MarkerArea';

export {
  MarkerArea,
  MarkerAreaEventData,
  MarkerAreaEventMap,
} from './MarkerArea';
export { MarkerBaseEditor, MarkerEditorState } from './editor/MarkerBaseEditor';
export { MarkerEditorProperties } from './editor/MarkerEditorProperties';
export { ColorType } from './editor/ColorType';
export { Grip } from './editor/Grip';
export { ResizeGrip } from './editor/ResizeGrip';
export { RotateGrip } from './editor/RotateGrip';
export { ShapeOutlineMarkerEditor } from './editor/ShapeOutlineMarkerEditor';
export { ShapeMarkerEditor } from './editor/ShapeMarkerEditor';
export { LinearMarkerEditor } from './editor/LinearMarkerEditor';
export { PolygonMarkerEditor } from './editor/PolygonMarkerEditor';
export { FreehandMarkerEditor } from './editor/FreehandMarkerEditor';
export { TextMarkerEditor } from './editor/TextMarkerEditor';
export { ArrowMarkerEditor } from './editor/ArrowMarkerEditor';

if (
  window &&
  window.customElements &&
  window.customElements.get('mjs-marker-area') === undefined
) {
  window.customElements.define('mjs-marker-area', MarkerArea);
}
