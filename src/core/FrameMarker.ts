import { ShapeOutlineMarkerBase } from "./ShapeOutlineMarkerBase";
import { ShapeOutlineMarkerBaseState } from "./ShapeOutlineMarkerBaseState";

export class FrameMarker extends ShapeOutlineMarkerBase {
  /**
   * String type name of the marker type. 
   */
  public static typeName = 'FrameMarker';
  
  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Frame marker';

  constructor(container: SVGGElement) {
    super(container);
  }

  public getState(): ShapeOutlineMarkerBaseState {
    const result = super.getState();
    result.typeName = FrameMarker.typeName;
    return result;
  }
}
