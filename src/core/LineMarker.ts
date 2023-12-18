import { LinearMarkerBase } from "./LinearMarkerBase";
import { LinearMarkerBaseState } from "./LinearMarkerBaseState";
import { SvgHelper } from "./SvgHelper";

export class LineMarker extends LinearMarkerBase {
  public static typeName = 'LineMarker';  
  public static title = 'Line marker'; 

  constructor(container: SVGGElement) {
    super(container);

    this.strokeColor = '#ff0000';
    this.strokeWidth = 3;

    this.createVisual = this.createVisual.bind(this);
  }

  public createVisual() {
    this.visual = SvgHelper.createGroup();
    this.selectorVisual = SvgHelper.createLine(
      this.x1,
      this.y1,
      this.x2,
      this.y2,
      [
        ['stroke', 'transparent'],
        ['stroke-width', Math.max(this.strokeWidth, 8).toString()],
      ]
    );
    this.visibleVisual = SvgHelper.createLine(
      this.x1,
      this.y1,
      this.x2,
      this.y2,
      [
        ['stroke', this.strokeColor],
        ['stroke-width', this.strokeWidth.toString()],
      ]
    );
    this.visual.appendChild(this.selectorVisual);
    this.visual.appendChild(this.visibleVisual);

    this.addMarkerVisualToContainer(this.visual);
  }

  /**
   * Adjusts visual after manipulation.
   */
  public adjustVisual(): void {
    if (this.selectorVisual && this.visibleVisual) {
      this.selectorVisual.setAttribute('x1', this.x1.toString());
      this.selectorVisual.setAttribute('y1', this.y1.toString());
      this.selectorVisual.setAttribute('x2', this.x2.toString());
      this.selectorVisual.setAttribute('y2', this.y2.toString());

      this.visibleVisual.setAttribute('x1', this.x1.toString());
      this.visibleVisual.setAttribute('y1', this.y1.toString());
      this.visibleVisual.setAttribute('x2', this.x2.toString());
      this.visibleVisual.setAttribute('y2', this.y2.toString());

      SvgHelper.setAttributes(this.visibleVisual, [['stroke', this.strokeColor]]);
      SvgHelper.setAttributes(this.visibleVisual, [['stroke-width', this.strokeWidth.toString()]]);
      SvgHelper.setAttributes(this.visibleVisual, [['stroke-dasharray', this.strokeDasharray.toString()]]);
    }
  }  

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): LinearMarkerBaseState {
    const result: LinearMarkerBaseState = super.getState();
    result.typeName = LineMarker.typeName;

    return result;
  }
}