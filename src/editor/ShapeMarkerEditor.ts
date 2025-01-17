import { ShapeMarkerBase } from '../core';
import { ShapeOutlineMarkerEditor } from './ShapeOutlineMarkerEditor';

/**
 * Editor for filled shape markers.
 *
 * @summary Filled shape marker editor.
 * @group Editors
 */
export class ShapeMarkerEditor<
  TMarkerType extends ShapeMarkerBase = ShapeMarkerBase,
> extends ShapeOutlineMarkerEditor<TMarkerType> {}
