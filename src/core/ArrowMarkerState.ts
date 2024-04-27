import { LinearMarkerBaseState } from './LinearMarkerBaseState';

export type ArrowType = 'both' | 'start' | 'end' | 'none';

export interface ArrowMarkerState extends LinearMarkerBaseState {
  arrowType: ArrowType;
}
