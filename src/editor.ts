import { MarkerArea } from "./MarkerArea";

export { MarkerArea, MarkerAreaEventData, MarkerAreaEventMap } from './MarkerArea';

if (
  window &&
  window.customElements &&
  window.customElements.get('mjs-marker-area') === undefined
) {
  window.customElements.define('mjs-marker-area', MarkerArea);
}
