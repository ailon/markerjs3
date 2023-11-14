import { IPoint } from "./IPoint";
import { MarkerBase } from "./MarkerBase";
import { MarkerBaseState } from "./MarkerBaseState";
import { RectangularBoxMarkerBaseState } from "./RectangularBoxMarkerBaseState";
import { SvgHelper } from "./SvgHelper";

/**
 * RectangularBoxMarkerBase is a base class for all marker's that conceptually fit into a rectangle
 * such as all rectangle markers, ellipse, text and callout markers.
 */
export class RectangularBoxMarkerBase extends MarkerBase {
  /**
   * x coordinate of the top-left corner.
   */
  protected left = 0;
  /**
   * y coordinate of the top-left corner.
   */
  protected top = 0;
  /**
   * Marker width.
   */
  protected width = 0;
  /**
   * Marker height.
   */
  protected height = 0;

  /**
   * The default marker size when the marker is created with a click (without dragging).
   */
  protected defaultSize: IPoint = {x: 50, y: 20};

  /**
   * Marker's rotation angle.
   */
  protected rotationAngle = 0;

  /**
   * x coordinate of the marker's center.
   */
  protected get centerX(): number {
    return this.left + this.width / 2;
  }
  /**
   * y coordinate of the marker's center.
   */
  protected get centerY(): number {
    return this.top + this.height / 2;
  }

  private _visual?: SVGGraphicsElement;
  /**
   * Container for the marker's visual.
   */
  protected get visual(): SVGGraphicsElement | undefined {
    return this._visual;
  }
  protected set visual(value: SVGGraphicsElement) {
    this._visual = value;
    const translate = SvgHelper.createTransform();
    this._visual.transform.baseVal.appendItem(translate);
  }

  constructor(container: SVGGElement) {
    super(container);

    // add rotation transform
    this.container.transform.baseVal.appendItem(SvgHelper.createTransform());    
  }

  /**
   * Moves visual to the specified coordinates.
   * @param point - coordinates of the new top-left corner of the visual.
   */
  protected moveVisual(point: IPoint): void {
    if (this.visual) {
      this.visual.style.transform = `translate(${point.x}px, ${point.y}px)`;
    }
  }

  private rotate(point: IPoint) {
    // avoid glitch when crossing the 0 rotation point
    if (Math.abs(point.x - this.centerX) > 0.1) {
      const sign = Math.sign(point.x - this.centerX);
      this.rotationAngle =
        (Math.atan((point.y - this.centerY) / (point.x - this.centerX)) * 180) /
          Math.PI +
        90 * sign;
      this.applyRotation();
    }
  }

  private applyRotation() {
    const rotate = this.container.transform.baseVal.getItem(0);
    rotate.setRotate(this.rotationAngle, this.centerX, this.centerY);
    this.container.transform.baseVal.replaceItem(rotate, 0);
  }

  /**
   * Returns point coordinates based on the actual screen coordinates and marker's rotation.
   * @param point - original pointer coordinates
   */
  protected rotatePoint(point: IPoint): IPoint {
    if (this.rotationAngle === 0) {
      return point;
    }
    
    const matrix = this.container.getCTM();
    if (matrix === null) {
      return point;
    }
    let svgPoint = SvgHelper.createPoint(point.x, point.y);
    svgPoint = svgPoint.matrixTransform(matrix);

    const result = { x: svgPoint.x, y: svgPoint.y };

    return result;
  }

  /**
   * Returns original point coordinates based on coordinates with rotation applied.
   * @param point - rotated point coordinates.
   */
  protected unrotatePoint(point: IPoint): IPoint {
    if (this.rotationAngle === 0) {
      return point;
    }
    
    let matrix = this.container.getCTM();
    if (matrix === null) {
      return point;
    }
    matrix = matrix.inverse();
    let svgPoint = SvgHelper.createPoint(point.x, point.y);
    svgPoint = svgPoint.matrixTransform(matrix);

    const result = { x: svgPoint.x, y: svgPoint.y };

    return result;
  }

  /**
   * Returns marker's state.
   */
  public getState(): RectangularBoxMarkerBaseState {
    const result: RectangularBoxMarkerBaseState = Object.assign({
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height,
      rotationAngle: this.rotationAngle,
    },
    super.getState());

    return result;
  }

  /**
   * Restores marker's state to the previously saved one.
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    super.restoreState(state);
    const rbmState = state as RectangularBoxMarkerBaseState;
    this.left = rbmState.left;
    this.top = rbmState.top;
    this.width = rbmState.width;
    this.height = rbmState.height;
    this.rotationAngle = rbmState.rotationAngle;
    this.moveVisual({x: this.left, y: this.top});
    this.applyRotation();
  }

  /**
   * Scales marker. Used after the image resize.
   * 
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    const rPoint = this.rotatePoint({x: this.left, y: this.top});
    const point = this.unrotatePoint({x: rPoint.x * scaleX, y: rPoint.y * scaleY});

    this.left = point.x;
    this.top = point.y;
    this.width = this.width * scaleX;
    this.height = this.height * scaleY;
  }
}