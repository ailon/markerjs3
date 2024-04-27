import { ArrowMarker, ArrowType } from '../core';
import { LinearMarkerEditor } from './LinearMarkerEditor';

export class ArrowMarkerEditor<
  TMarkerType extends ArrowMarker = ArrowMarker,
> extends LinearMarkerEditor<TMarkerType> {
  public set arrowType(value: ArrowType) {
    this.marker.arrowType = value;
  }

  public get arrowType(): ArrowType {
    return this.marker.arrowType;
  }
}
