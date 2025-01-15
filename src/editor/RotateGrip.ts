import { Grip } from './Grip';

/**
 * Represents a rotation grip.
 */
export class RotateGrip extends Grip {
  constructor() {
    super();
    // swap fill and stroke colors
    const oldFill = this.fillColor;
    this.fillColor = this.strokeColor;
    this.strokeColor = oldFill;
  }
}
