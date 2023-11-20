import { MarkerBaseState } from "./MarkerBaseState";
import { ShapeOutlineMarkerBase } from "./ShapeOutlineMarkerBase";
import { ShapeMarkerBaseState } from "./ShapeMarkerBaseState";
import { SvgHelper } from "./SvgHelper";

export abstract class ShapeMarkerBase extends ShapeOutlineMarkerBase {
  public static title = 'Shape marker';

  protected fillColor = 'transparent';

  constructor(container: SVGGElement) {
    super(container);

    this.setFillColor = this.setFillColor.bind(this);

    this.createVisual = this.createVisual.bind(this);

  }

  public createVisual(): void {
    super.createVisual();
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['fill', this.fillColor]]);
    }
  }

  protected setFillColor(color: string): void {
    this.fillColor = color;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['fill', this.fillColor]]);
    }
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): ShapeMarkerBaseState {
    const result: ShapeMarkerBaseState = Object.assign({
      fillColor: this.fillColor,
    }, super.getState());

    return result;
  }

  /**
   * Restores previously saved marker state.
   * 
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    const rectState = state as ShapeMarkerBaseState;
    this.fillColor = rectState.fillColor;

    super.restoreState(state);
    this.setSize();
  }
}