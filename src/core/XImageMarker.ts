import { ImageMarkerBase } from './ImageMarkerBase';

/**
 * X mark marker.
 */
export class XImageMarker extends ImageMarkerBase {
  /**
   * String type name of the marker type.
   */
  public static typeName = 'XImageMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'X image marker';

  constructor(container: SVGGElement) {
    super(container);

    this._svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9l-6 6m0-6l6 6"/></g></svg>`;
    this.strokeColor = '#d00000';
  }
}
