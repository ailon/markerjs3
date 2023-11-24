import { MarkerBaseState } from "./MarkerBaseState";

export interface AnnotationState {
  version?: number;

  width: number;
  height: number;

  markers: MarkerBaseState[];
}