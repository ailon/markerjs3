import { ImageMarkerBase } from './ImageMarkerBase';

/**
 * Used to represent user-set images.
 */
export class CustomImageMarker extends ImageMarkerBase {
  /**
   * String type name of the marker type.
   */
  public static typeName = 'CustomImageMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Custom image marker';
}
