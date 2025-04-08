/**
 * @module Viewer
 * @category API Reference
 */
import { MarkerView } from './MarkerView';
import { isServerSide } from './server-side';

export {
  MarkerView,
  MarkerViewEventData,
  MarkerEventData,
  MarkerViewEventMap,
} from './MarkerView';

if (
  !isServerSide &&
  window &&
  window.customElements &&
  window.customElements.get('mjs-marker-view') === undefined
) {
  window.customElements.define('mjs-marker-view', MarkerView);
}
