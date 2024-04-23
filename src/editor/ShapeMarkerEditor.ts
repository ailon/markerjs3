import { ShapeMarkerBase } from '../core';
import { ShapeOutlineMarkerEditor } from './ShapeOutlineMarkerEditor';

export class ShapeMarkerEditor<
  TMarkerType extends ShapeMarkerBase = ShapeMarkerBase,
> extends ShapeOutlineMarkerEditor<TMarkerType> {}
