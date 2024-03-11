import { FontSize } from './FontSize';
import { RectangularBoxMarkerBaseState } from './RectangularBoxMarkerBaseState';

export interface TextMarkerState extends RectangularBoxMarkerBaseState {
  color: string;
  fontFamily: string;
  fontSize: FontSize;
  text: string;
}