import { MarkerBaseState } from './MarkerBaseState';
import { ShapeOutlineMarkerBase } from './ShapeOutlineMarkerBase';
import { ShapeMarkerBaseState } from './ShapeMarkerBaseState';
import { SvgHelper } from './SvgHelper';

/**
 * Base class for filled shape markers.
 */
export abstract class ShapeMarkerBase extends ShapeOutlineMarkerBase {
  public static title = 'Shape marker';

  /**
   * Marker's fill color.
   */
  protected _fillColor = 'transparent';
  /**
   * Applies the fill color to the marker's visual.
   *
   * If needed, override this method in a derived class to apply the color to the marker's visual.
   */
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

  public getState(): ShapeMarkerBaseState {
    const result: ShapeMarkerBaseState = Object.assign(
      {
        fillColor: this._fillColor,
      },
      super.getState(),
    );

    return result;
  }

  public restoreState(state: MarkerBaseState): void {
    const rectState = state as ShapeMarkerBaseState;
    super.restoreState(state);

    this.fillColor = rectState.fillColor;

    this.setSize();
  }
}
