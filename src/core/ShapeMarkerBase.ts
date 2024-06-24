import { MarkerBaseState } from './MarkerBaseState';
import { ShapeOutlineMarkerBase } from './ShapeOutlineMarkerBase';
import { ShapeMarkerBaseState } from './ShapeMarkerBaseState';
import { SvgHelper } from './SvgHelper';

export abstract class ShapeMarkerBase extends ShapeOutlineMarkerBase {
  public static title = 'Shape marker';

  protected _fillColor = 'transparent';
  protected applyFillColor() {
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['fill', this._fillColor]]);
    }
  }

  constructor(container: SVGGElement) {
    super(container);

    this.createVisual = this.createVisual.bind(this);
  }

  public createVisual(): void {
    super.createVisual();
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['fill', this._fillColor]]);
    }
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): ShapeMarkerBaseState {
    const result: ShapeMarkerBaseState = Object.assign(
      {
        fillColor: this._fillColor,
      },
      super.getState(),
    );

    return result;
  }

  /**
   * Restores previously saved marker state.
   *
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    const rectState = state as ShapeMarkerBaseState;
    super.restoreState(state);

    this.fillColor = rectState.fillColor;

    this.setSize();
  }
}
