import { IPoint } from './IPoint';
import { TextMarkerState } from './TextMarkerState';

export interface CalloutMarkerState extends TextMarkerState {
  tipPosition: IPoint;
}
