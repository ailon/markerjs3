import { RectangularBoxMarkerBaseState } from './RectangularBoxMarkerBaseState';

export type ImageType = 'svg' | 'bitmap';

/**
 * Represents image marker's state.
 */
export interface ImageMarkerBaseState extends RectangularBoxMarkerBaseState {
  imageType?: ImageType;
  imageSrc?: string;
}
