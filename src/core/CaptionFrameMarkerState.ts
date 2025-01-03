import { ShapeMarkerBaseState } from './ShapeMarkerBaseState';
import { TextMarkerState } from './TextMarkerState';

export interface CaptionFrameMarkerState
  extends TextMarkerState,
    ShapeMarkerBaseState {}
