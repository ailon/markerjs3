import { GripLocation } from './Grip';
import { ResizeGrip } from './ResizeGrip';

/**
 * RectangularBoxMarkerGrips is a set of resize/rotation grips for a rectangular marker.
 */
export class RectangularBoxMarkerGrips {
  public grips = new Map<GripLocation, ResizeGrip>([
    ['topleft', new ResizeGrip()],
    ['topcenter', new ResizeGrip()],
    ['topright', new ResizeGrip()],
    ['leftcenter', new ResizeGrip()],
    ['rightcenter', new ResizeGrip()],
    ['bottomleft', new ResizeGrip()],
    ['bottomcenter', new ResizeGrip()],
    ['bottomright', new ResizeGrip()],
  ]);
  /**
   * Creates a new marker grip set.
   */
  constructor() {
    this.findGripByVisual = this.findGripByVisual.bind(this);
  }

  /**
   * Returns a marker grip owning the specified visual.
   * @param gripVisual - visual for owner to be determined.
   */
  public findGripByVisual(gripVisual: EventTarget): ResizeGrip | undefined {
    for (const grip of this.grips.values()) {
      if (grip.ownsTarget(gripVisual)) {
        return grip;
      }
    }
    return undefined;
  }

  /**
   * Returns a grip by its location.
   * @param location
   * @returns
   */
  public getGrip(location: GripLocation): ResizeGrip {
    return this.grips.get(location)!;
  }
}
