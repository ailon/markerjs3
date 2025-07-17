import { IPoint, RectangularBoxMarkerBase, SvgHelper } from '../core';
import { Grip, GripLocation } from './Grip';
import { MarkerBaseEditor } from './MarkerBaseEditor';
import { RectangularBoxMarkerGrips } from './RectangularBoxMarkerGrips';
import { RotateGrip } from './RotateGrip';

/**
 * Base editor for markers that can be represented by a rectangular area.
 *
 * @summary Base editor for markers that can be represented by a rectangular area.
 * @group Editors
 */
export class RectangularBoxMarkerBaseEditor<
  TMarkerType extends RectangularBoxMarkerBase = RectangularBoxMarkerBase,
> extends MarkerBaseEditor<TMarkerType> {
  /**
   * x coordinate of the top-left corner at the start of manipulation.
   */
  protected manipulationStartLeft = 0;
  /**
   * y coordinate of the top-left corner at the start of manipulation.
   */
  protected manipulationStartTop = 0;
  /**
   * Width at the start of manipulation.
   */
  protected manipulationStartWidth = 0;
  /**
   * Height at the start of manipulation.
   */
  protected manipulationStartHeight = 0;

  /**
   * x coordinate of the pointer at the start of manipulation.
   */
  protected manipulationStartX = 0;
  /**
   * y coordinate of the pointer at the start of manipulation.
   */
  protected manipulationStartY = 0;

  /**
   * Pointer's horizontal distance from the top left corner.
   */
  protected offsetX = 0;
  /**
   * Pointer's vertical distance from the top left corner.
   */
  protected offsetY = 0;

  /**
   * Container for the marker's editing controls.
   */
  protected controlBox?: SVGGElement;
  /**
   * Container for the marker's manipulation grips.
   */
  protected manipulationBox = SvgHelper.createGroup();
  private readonly CB_DISTANCE: number = 0;
  private controlRect?: SVGRectElement;
  private rotatorGripLine?: SVGLineElement;

  private controlGrips: RectangularBoxMarkerGrips =
    new RectangularBoxMarkerGrips();
  /**
   * Array of disabled resize grips.
   *
   * Use this in derived classes to disable specific resize grips.
   */
  protected disabledResizeGrips: GripLocation[] = [];
  private rotatorGrip?: RotateGrip;
  /**
   * Active grip during manipulation
   */
  protected activeGrip?: Grip;
  private disableRotation = false;

  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || this._marker.ownsTarget(el)) {
      return true;
    } else if (
      this.controlGrips?.findGripByVisual(el) !== undefined ||
      (this.rotatorGrip !== undefined && this.rotatorGrip.ownsTarget(el))
    ) {
      return true;
    } else {
      return false;
    }
  }

  public override pointerDown(
    point: IPoint,
    target?: EventTarget,
    ev?: PointerEvent,
  ): void {
    super.pointerDown(point, target, ev);

    if (this.state === 'new') {
      this.setupControlBox();

      this.marker.left = point.x;
      this.marker.top = point.y;
    }

    this.manipulationStartLeft = this.marker.left;
    this.manipulationStartTop = this.marker.top;
    this.manipulationStartWidth = this.marker.width;
    this.manipulationStartHeight = this.marker.height;

    const rotatedPoint = this.marker.unrotatePoint(point);
    this.manipulationStartX = rotatedPoint.x;
    this.manipulationStartY = rotatedPoint.y;

    this.offsetX = rotatedPoint.x - this.marker.left;
    this.offsetY = rotatedPoint.y - this.marker.top;

    if (this.state !== 'new') {
      this.select(this.isMultiSelected);
      this.activeGrip = this.controlGrips?.findGripByVisual(
        target as SVGGraphicsElement,
      );
      if (this.activeGrip !== undefined) {
        this._state = 'resize';
      } else if (
        this.rotatorGrip !== undefined &&
        target !== undefined &&
        this.rotatorGrip.ownsTarget(target)
      ) {
        this.activeGrip = this.rotatorGrip;

        const rotatedCenter = this.marker.rotatePoint({
          x: this.marker.centerX,
          y: this.marker.centerY,
        });
        this.marker.left = rotatedCenter.x - this.marker.width / 2;
        this.marker.top = rotatedCenter.y - this.marker.height / 2;
        this.marker.moveVisual({ x: this.marker.left, y: this.marker.top });

        const rotate = this.container.transform.baseVal.getItem(0);
        rotate.setRotate(
          this.marker.rotationAngle,
          this.marker.centerX,
          this.marker.centerY,
        );
        this.container.transform.baseVal.replaceItem(rotate, 0);

        this.adjustControlBox();

        this._state = 'rotate';
      } else {
        this._state = 'move';
      }
    }
  }

  /**
   * When set to true marker created event will not be triggered.
   */
  protected _suppressMarkerCreateEvent = false;

  public override pointerUp(point: IPoint, ev?: PointerEvent): void {
    const inState = this.state;
    super.pointerUp(point, ev);
    if (
      this.state === 'creating' &&
      this.marker.width < 10 &&
      this.marker.height < 10
    ) {
      this.marker.width = this.marker.defaultSize.width;
      this.marker.height = this.marker.defaultSize.height;
    } else {
      this.manipulate(point, ev);
    }
    this._state = 'select';
    if (
      inState === 'creating' &&
      this.onMarkerCreated &&
      this._suppressMarkerCreateEvent === false
    ) {
      this.onMarkerCreated(this);
    }
    this.stateChanged();
  }

  public override manipulate(point: IPoint, ev?: PointerEvent): void {
    const rotatedPoint = this.marker.unrotatePoint(point);

    if (this.state === 'creating') {
      this.resize(point, ev?.shiftKey);
    } else if (this.state === 'move') {
      this.marker.left =
        this.manipulationStartLeft +
        (rotatedPoint.x - this.manipulationStartLeft) -
        this.offsetX;
      this.marker.top =
        this.manipulationStartTop +
        (rotatedPoint.y - this.manipulationStartTop) -
        this.offsetY;
      this.marker.moveVisual({ x: this.marker.left, y: this.marker.top });
      this.adjustControlBox();
    } else if (this.state === 'resize') {
      this.resize(rotatedPoint, ev?.shiftKey);
    } else if (this.state === 'rotate') {
      this.marker.rotate(point);
    }
  }

  protected resize(point: IPoint, preserveAspectRatio = false): void {
    let newX = this.manipulationStartLeft;
    let newWidth = this.manipulationStartWidth;
    let newY = this.manipulationStartTop;
    let newHeight = this.manipulationStartHeight;

    const deltaX = point.x - this.manipulationStartX;
    const deltaY = point.y - this.manipulationStartY;
    if (preserveAspectRatio) {
      const aspectRatio =
        this.manipulationStartWidth !== 0 && this.manipulationStartHeight !== 0
          ? this.manipulationStartWidth / this.manipulationStartHeight
          : 1;
      switch (this.activeGrip) {
        // undefined when creating a new marker
        case this.controlGrips.getGrip('bottomright'):
        case undefined: {
          newWidth = this.manipulationStartWidth + Math.max(deltaX, deltaY);
          newHeight =
            this.manipulationStartHeight +
            Math.max(deltaX, deltaY) / aspectRatio;
          break;
        }
        case this.controlGrips.getGrip('bottomcenter'): {
          newWidth = this.manipulationStartWidth + deltaY;
          newHeight = this.manipulationStartHeight + deltaY / aspectRatio;
          newX = this.manipulationStartLeft - deltaY / 2;
          break;
        }
        case this.controlGrips.getGrip('bottomleft'): {
          newWidth = this.manipulationStartWidth + Math.max(-deltaX, deltaY);
          newHeight =
            this.manipulationStartHeight +
            Math.max(-deltaX, deltaY) / aspectRatio;
          newX = this.manipulationStartLeft - Math.max(-deltaX, deltaY);
          break;
        }
        case this.controlGrips.getGrip('leftcenter'): {
          newWidth = this.manipulationStartWidth - deltaX;
          newHeight = this.manipulationStartHeight - deltaX / aspectRatio;
          newX = this.manipulationStartLeft + deltaX;
          newY = this.manipulationStartTop + deltaX / aspectRatio / 2;
          break;
        }
        case this.controlGrips.getGrip('topleft'): {
          newWidth = this.manipulationStartWidth + Math.max(-deltaX, -deltaY);
          newHeight =
            this.manipulationStartHeight +
            Math.max(-deltaX, -deltaY) / aspectRatio;
          newX = this.manipulationStartLeft - Math.max(-deltaX, -deltaY);
          newY =
            this.manipulationStartTop -
            Math.max(-deltaX, -deltaY) / aspectRatio;
          break;
        }
        case this.controlGrips.getGrip('topcenter'): {
          newWidth = this.manipulationStartWidth - deltaY;
          newHeight = this.manipulationStartHeight - deltaY / aspectRatio;
          newX = this.manipulationStartLeft + deltaY / 2;
          newY = this.manipulationStartTop + deltaY / aspectRatio;
          break;
        }
        case this.controlGrips.getGrip('topright'): {
          newWidth = this.manipulationStartWidth + Math.max(deltaX, -deltaY);
          newHeight =
            this.manipulationStartHeight +
            Math.max(deltaX, -deltaY) / aspectRatio;
          newY =
            this.manipulationStartTop - Math.max(deltaX, -deltaY) / aspectRatio;
          break;
        }
        case this.controlGrips.getGrip('rightcenter'): {
          newWidth = this.manipulationStartWidth + deltaX;
          newHeight = this.manipulationStartHeight + deltaX / aspectRatio;
          newY = this.manipulationStartTop - deltaX / aspectRatio / 2;
          break;
        }
      }
    } else {
      // free form resizing
      switch (this.activeGrip) {
        case this.controlGrips.getGrip('bottomleft'):
        case this.controlGrips.getGrip('leftcenter'):
        case this.controlGrips.getGrip('topleft'):
          newX = this.manipulationStartLeft + point.x - this.manipulationStartX;
          newWidth =
            this.manipulationStartWidth + this.manipulationStartLeft - newX;
          break;
        case this.controlGrips.getGrip('bottomright'):
        case this.controlGrips.getGrip('rightcenter'):
        case this.controlGrips.getGrip('topright'):
        case undefined:
          newWidth =
            this.manipulationStartWidth + point.x - this.manipulationStartX;
          break;
      }

      switch (this.activeGrip) {
        case this.controlGrips.getGrip('topcenter'):
        case this.controlGrips.getGrip('topleft'):
        case this.controlGrips.getGrip('topright'):
          newY = this.manipulationStartTop + point.y - this.manipulationStartY;
          newHeight =
            this.manipulationStartHeight + this.manipulationStartTop - newY;
          break;
        case this.controlGrips.getGrip('bottomcenter'):
        case this.controlGrips.getGrip('bottomleft'):
        case this.controlGrips.getGrip('bottomright'):
        case undefined:
          newHeight =
            this.manipulationStartHeight + point.y - this.manipulationStartY;
          break;
      }
    }

    if (newWidth >= 0) {
      this.marker.left = newX;
      this.marker.width = newWidth;
    } else {
      this.marker.left = newX + newWidth;
      this.marker.width = -newWidth;
    }
    if (newHeight >= 0) {
      this.marker.top = newY;
      this.marker.height = newHeight;
    } else {
      this.marker.top = newY + newHeight;
      this.marker.height = -newHeight;
    }

    this.setSize();
  }

  /**
   * Sets control box size and location.
   */
  protected setSize(): void {
    this.marker.setSize();
    this.adjustControlBox();
  }

  public select(multi = false): void {
    super.select(multi);
    this.adjustControlBox();
    this.manipulationBox.style.display = multi ? 'none' : '';
    if (this.controlBox) {
      this.controlBox.style.display = '';
    }
  }

  public deselect(): void {
    super.deselect();
    if (this.controlBox) {
      this.controlBox.style.display = 'none';
    }
  }

  /**
   * Creates control box for manipulation controls.
   */
  protected setupControlBox() {
    this.controlBox = SvgHelper.createGroup();
    const translate = SvgHelper.createTransform();
    translate.setTranslate(-this.CB_DISTANCE / 2, -this.CB_DISTANCE / 2);
    this.controlBox.transform.baseVal.appendItem(translate);

    this.container.appendChild(this.controlBox);

    this.manipulationBox = SvgHelper.createGroup();
    this.controlBox.appendChild(this.manipulationBox);

    this.controlRect = SvgHelper.createRect(
      this.marker.width + this.CB_DISTANCE,
      this.marker.height + this.CB_DISTANCE,
      [
        ['stroke', 'black'],
        ['stroke-width', (1 / this.zoomLevel).toString()],
        ['stroke-opacity', '0.5'],
        ['stroke-dasharray', '3, 2'],
        ['fill', 'transparent'],
        ['pointer-events', 'none'],
      ],
    );

    this.controlBox.appendChild(this.controlRect);

    if (this.disableRotation !== true) {
      this.rotatorGripLine = SvgHelper.createLine(
        (this.marker.width + this.CB_DISTANCE * 2) / 2,
        this.marker.top - this.CB_DISTANCE,
        (this.marker.width + this.CB_DISTANCE * 2) / 2,
        this.marker.top - this.CB_DISTANCE * 3,
        [
          ['stroke', 'black'],
          ['stroke-width', (1 / this.zoomLevel).toString()],
          ['stroke-opacity', '0.5'],
          ['stroke-dasharray', '3, 2'],
        ],
      );
      this.rotatorGripLine.style.filter =
        'drop-shadow(rgba(255, 255, 255, 0.7) 0px 2px 0px)';

      this.manipulationBox.appendChild(this.rotatorGripLine);
    }

    this.controlGrips = new RectangularBoxMarkerGrips();
    this.addControlGrips();

    this.controlBox.style.display = 'none';
  }

  /**
   * Adjusts control box size and location.
   */
  protected adjustControlBox() {
    if (this.controlBox) {
      const translate = this.controlBox.transform.baseVal.getItem(0);
      translate.setTranslate(
        this.marker.left - this.CB_DISTANCE / 2,
        this.marker.top - this.CB_DISTANCE / 2,
      );
      this.controlBox.transform.baseVal.replaceItem(translate, 0);
      this.controlRect?.setAttribute(
        'width',
        (this.marker.width + this.CB_DISTANCE).toString(),
      );
      this.controlRect?.setAttribute(
        'height',
        (this.marker.height + this.CB_DISTANCE).toString(),
      );
      this.controlRect?.setAttribute(
        'stroke-width',
        (1 / this.zoomLevel).toString(),
      );

      if (this.rotatorGripLine !== undefined) {
        this.rotatorGripLine.setAttribute(
          'x1',
          ((this.marker.width + this.CB_DISTANCE) / 2).toString(),
        );
        this.rotatorGripLine.setAttribute(
          'y1',
          (-this.CB_DISTANCE / 2).toString(),
        );
        this.rotatorGripLine.setAttribute(
          'x2',
          ((this.marker.width + this.CB_DISTANCE) / 2).toString(),
        );
        this.rotatorGripLine.setAttribute(
          'y2',
          (-Math.max(this.CB_DISTANCE * 3, 30)).toString(),
        );
        this.rotatorGripLine.setAttribute(
          'stroke-width',
          (1 / this.zoomLevel).toString(),
        );
      }

      this.positionGrips();
    }
  }

  /**
   * Adds control grips to control box.
   */
  protected addControlGrips() {
    for (const grip of this.controlGrips.grips.values()) {
      grip.visual.transform.baseVal.appendItem(SvgHelper.createTransform());
      this.manipulationBox.appendChild(grip.visual);

      this.manipulationBox.appendChild(grip.visual);
    }

    if (this.disableRotation !== true) {
      this.rotatorGrip = this.createRotateGrip();
    }

    this.positionGrips();
  }

  // private createResizeGrip(): ResizeGrip {
  //   const grip = new ResizeGrip();
  //   grip.visual.transform.baseVal.appendItem(SvgHelper.createTransform());
  //   this.controlBox.appendChild(grip.visual);

  //   return grip;
  // }

  private createRotateGrip(): RotateGrip {
    const grip = new RotateGrip();
    grip.visual.transform.baseVal.appendItem(SvgHelper.createTransform());
    this.manipulationBox.appendChild(grip.visual);

    return grip;
  }

  /**
   * Updates manipulation grip layout.
   */
  protected positionGrips() {
    if (this.controlGrips !== undefined) {
      const gripSize = this.controlGrips.getGrip('topleft').gripSize ?? 0;

      const left = -gripSize / 2;
      const top = left;
      const cx = (this.marker.width + this.CB_DISTANCE) / 2 - gripSize / 2;
      const cy = (this.marker.height + this.CB_DISTANCE) / 2 - gripSize / 2;
      const bottom = this.marker.height + this.CB_DISTANCE - gripSize / 2;
      const right = this.marker.width + this.CB_DISTANCE - gripSize / 2;

      this.positionGrip(this.controlGrips.getGrip('topleft').visual, left, top);
      this.positionGrip(this.controlGrips.getGrip('topcenter').visual, cx, top);
      this.positionGrip(
        this.controlGrips.getGrip('topright').visual,
        right,
        top,
      );
      this.positionGrip(
        this.controlGrips.getGrip('leftcenter').visual,
        left,
        cy,
      );
      this.positionGrip(
        this.controlGrips.getGrip('rightcenter').visual,
        right,
        cy,
      );
      this.positionGrip(
        this.controlGrips.getGrip('bottomleft').visual,
        left,
        bottom,
      );
      this.positionGrip(
        this.controlGrips.getGrip('bottomcenter').visual,
        cx,
        bottom,
      );
      this.positionGrip(
        this.controlGrips.getGrip('bottomright').visual,
        right,
        bottom,
      );

      this.controlGrips.grips.forEach((grip) => {
        grip.zoomLevel = this.zoomLevel;
      });

      if (this.rotatorGrip !== undefined) {
        this.rotatorGrip.zoomLevel = this.zoomLevel;
        const rotatorGripSize = this.rotatorGrip.gripSize ?? 0;
        const rtop = -rotatorGripSize / 2;
        const rcx =
          (this.marker.width + this.CB_DISTANCE) / 2 - rotatorGripSize / 2;

        this.positionGrip(
          this.rotatorGrip.visual,
          rcx,
          rtop -
            Math.max(Math.max(this.CB_DISTANCE * 3, 30), 15 / this.zoomLevel), // magic numbers - may need to rethink
        );
      }
    }
    this.adjustGripVisibility();
  }

  /**
   * Positions specific grip.
   * @param grip
   * @param x
   * @param y
   */
  protected positionGrip(
    grip: SVGGraphicsElement | undefined,
    x: number,
    y: number,
  ) {
    if (grip !== undefined) {
      const translate = grip.transform.baseVal.getItem(0);
      translate.setTranslate(x, y);
      grip.transform.baseVal.replaceItem(translate, 0);
    }
  }

  /**
   * Hides marker's editing controls.
   */
  protected hideControlBox(): void {
    if (this.controlBox) {
      this.controlBox.style.display = 'none';
    }
  }
  /**
   * Shows marker's editing controls.
   */
  protected showControlBox(): void {
    if (this.controlBox) {
      this.controlBox.style.display = '';
    }
  }

  /**
   * Adjusts visibility of resize grips.
   */
  protected adjustGripVisibility() {
    for (const location of this.disabledResizeGrips) {
      const grip = this.controlGrips.getGrip(location);
      if (grip !== undefined) {
        grip.visual.style.display = 'none';
      }
    }
  }

  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    this.adjustControlBox();
  }
}
