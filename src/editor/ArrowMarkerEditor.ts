import { ArrowMarker, ArrowType } from '../core';
import { LinearMarkerEditor } from './LinearMarkerEditor';

/**
 * Editor for arrow markers.
 *
 * @summary Arrow marker editor.
 * @group Editors
 */
export class ArrowMarkerEditor<
  TMarkerType extends ArrowMarker = ArrowMarker,
> extends LinearMarkerEditor<TMarkerType> {
  /**
   * Sets the arrow type.
   */
  public set arrowType(value: ArrowType) {
    this.marker.arrowType = value;
  }

  /**
   * Returns the arrow type.
   */
  public get arrowType(): ArrowType {
    return this.marker.arrowType;
  }
}
