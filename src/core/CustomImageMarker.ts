import { ImageMarkerBase } from './ImageMarkerBase';
import { ImageMarkerBaseState } from './ImageMarkerBaseState';

export class CustomImageMarker extends ImageMarkerBase {
  /**
   * String type name of the marker type.
   */
  public static typeName = 'CustomImageMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Image marker';

  constructor(container: SVGGElement) {
    super(container);

    this._imageSrc =
      'data:image/png;base64,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';
  }

  public getState(): ImageMarkerBaseState {
    const result = super.getState();
    result.typeName = CustomImageMarker.typeName;
    return result;
  }
}
