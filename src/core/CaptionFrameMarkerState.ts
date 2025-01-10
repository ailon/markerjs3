import { ShapeMarkerBaseState } from './ShapeMarkerBaseState';
import { TextMarkerState } from './TextMarkerState';

/**
 * Represents the state of a caption frame marker.
 */
export interface CaptionFrameMarkerState
  extends TextMarkerState,
    ShapeMarkerBaseState {}
