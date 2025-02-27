/**
 * @module Viewer
 * @category API Reference
 */
import { MarkerView } from './MarkerView';

export {
  MarkerView,
  MarkerViewEventData,
  MarkerEventData,
  MarkerViewEventMap,
} from './MarkerView';

if (
  window &&
  window.customElements &&
  window.customElements.get('mjs-marker-view') === undefined
) {
  window.customElements.define('mjs-marker-view', MarkerView);
}
