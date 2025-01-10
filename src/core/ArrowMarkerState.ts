import { LinearMarkerBaseState } from './LinearMarkerBaseState';

/**
 * Arrow type.
 *
 * Specifies whether the arrow should be drawn at the start, end, both ends or none.
 */
export type ArrowType = 'both' | 'start' | 'end' | 'none';

/**
 * Represents the state of the arrow marker.
 */
export interface ArrowMarkerState extends LinearMarkerBaseState {
  arrowType: ArrowType;
}
