import { ImageMarkerBase } from './ImageMarkerBase';

/**
 * Check mark marker.
 */
export class CheckImageMarker extends ImageMarkerBase {
  /**
   * String type name of the marker type.
   */
  public static typeName = 'CheckImageMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Check image marker';

  constructor(container: SVGGElement) {
    super(container);

    this._svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11l3 3L22 4"/></g></svg>`;
    this.strokeColor = '#008000';
  }
}
