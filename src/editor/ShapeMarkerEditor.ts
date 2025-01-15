import { ShapeMarkerBase } from '../core';
import { ShapeOutlineMarkerEditor } from './ShapeOutlineMarkerEditor';

/**
 * Editor for filled shape markers.
 */
export class ShapeMarkerEditor<
  TMarkerType extends ShapeMarkerBase = ShapeMarkerBase,
> extends ShapeOutlineMarkerEditor<TMarkerType> {}
