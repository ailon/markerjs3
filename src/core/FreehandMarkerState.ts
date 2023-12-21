import { IPoint } from './IPoint';
import { MarkerBaseState } from './MarkerBaseState';

export interface FreehandMarkerState extends MarkerBaseState {
  points: Array<IPoint>,
}
