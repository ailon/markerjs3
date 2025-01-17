import { ImageMarkerBase } from './ImageMarkerBase';

/**
 * Used to represent user-set images.
 *
 * Use this marker to display custom images at runtime.
 * For example, you can use this type to represent emojis selected in an emoji picker.
 *
 * @summary Custom image marker.
 * @group Markers
 */
export class CustomImageMarker extends ImageMarkerBase {
  public static typeName = 'CustomImageMarker';
  public static title = 'Custom image marker';
}
