import { MarkerArea } from "./MarkerArea";

export { MarkerArea, MarkerAreaEventData, MarkerAreaEventMap } from './MarkerArea';
export { MarkerBaseEditor, MarkerEditorState } from './editor/MarkerBaseEditor';
export { MarkerEditorProperties } from './editor/MarkerEditorProperties';

if (
  window &&
  window.customElements &&
  window.customElements.get('mjs-marker-area') === undefined
) {
  window.customElements.define('mjs-marker-area', MarkerArea);
}
