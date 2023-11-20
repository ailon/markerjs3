import { Grip } from './Grip';

export class RotateGrip extends Grip {

  constructor() {
    super();
    // swap fill and stroke colors
    const oldFill = this.fillColor;
    this.fillColor = this.strokeColor;
    this.strokeColor = oldFill;
  }
}
