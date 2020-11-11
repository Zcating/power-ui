import { CSSProperties, isRef, ref, Ref, ComponentPublicInstance } from 'vue';
import { ConnectionPosition, ConnectionPositionPair, HorizontalConnectionPos, VerticalConnectionPos } from "./position-pair";
import { PositionStrategy, OverlayProps } from "./position-strategy";
import { coerceCssPixelValue } from '../../coercion';
import { getElement } from '../../utils';
interface Point {
  x: number;
  y: number;
}

export type FlexiblePositionStrategyOrigin = Element | Ref<ComponentPublicInstance | Element | undefined | null> | (Point & {
  width?: number;
  height?: number;
});

/**
 * @description
 * Flexible position strategy can let your overlay
 * content flexible in a overlay wrapper dom.
 * @date 2020-09-22
 * @export
 * @class FlexiblePositionStrategy
 */
export class FlexiblePositionStrategy extends PositionStrategy {

  private _positionPair: ConnectionPositionPair = new ConnectionPositionPair({
    originX: 'left',
    originY: 'bottom',
    overlayX: 'left',
    overlayY: 'top',
  });

  private subscribe?: () => void;

  private isVisible = false;

  private positionedStyle = ref<CSSProperties>({ position: 'static' });

  private height = 100;
  private width = 100;

  constructor(
    private _origin: FlexiblePositionStrategyOrigin,
    private window: Window,
  ) {
    super();
  }

  setup(): OverlayProps {
    return {
      positionedStyle: this.positionedStyle,
      containerStyle: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh'
      }
    };
  }

  apply(panel: HTMLElement): void {
    this.isVisible = true;
    this._calculatePosition(panel);
  }

  disapply(): void {
    this.isVisible = false;
    if (this.subscribe) {
      this.window.removeEventListener('scroll', this.subscribe);
    }
  }

  dispose(): void {
    if (this.subscribe) {
      this.window.removeEventListener('scroll', this.subscribe);
    }
  }

  /**
   * Sets the origin of the overlay.
   * 
   * @param value New origin.
   */
  origin(value: FlexiblePositionStrategyOrigin) {
    this._origin = value;
    return this;
  }

  /**
   * Sets the position pair of the overlay.
   * In flexible overlay, you need to mark 
   * two anchor points, one is the element
   * you want to anchor on it, the another
   * one is Overlay.
   * @param value New position pair.
   */
  positionPair(
    originX: HorizontalConnectionPos,
    originY: VerticalConnectionPos,
    overlayX: HorizontalConnectionPos,
    overlayY: VerticalConnectionPos
  ): this;
  positionPair(position: ConnectionPosition): this;
  positionPair(value: ConnectionPositionPair): this;
  positionPair(...values: any[]): this {
    if (values[0] instanceof ConnectionPositionPair) {
      this._positionPair = values[0];
    } else if (typeof values[0] === 'object') {
      this._positionPair = new ConnectionPositionPair(values[0]);
    } else {
      this._positionPair = new ConnectionPositionPair(
        {
          originX: values[0],
          originY: values[1],
          overlayX: values[2],
          overlayY: values[3],
        }
      )
    }
    return this;
  }

  private _calculatePosition(panel: HTMLElement): void {
    // get overlay rect
    const originRect = this._getOriginRect();

    // calculate the origin point
    const originPoint = this._getOriginPoint(originRect, this._positionPair);

    const rect = panel.getBoundingClientRect();
    // calculate the overlay anchor point
    const point = this._getOverlayPoint(originPoint, this._positionPair, rect);
    // set the current position style's value.
    // the current position style is a 'ref'.
    const style = this.positionedStyle.value;
    style.position = 'absolute';
    style.left = coerceCssPixelValue(point.x);
    style.top = coerceCssPixelValue(point.y);
    style.minWidth = coerceCssPixelValue(rect.width);
    style.minHeight = coerceCssPixelValue(rect.height);

    this.positionedStyle.value = style;

    // at last, we need to caculate the position
    // when scrolling.
    this._caculateScroll(this.positionedStyle, point);
  }

  private _getOverlayPoint(originPoint: Point, position: ConnectionPositionPair, rect: DOMRect): Point {
    let x: number;
    const { width, height } = rect;
    if (position.overlayX == 'center') {
      x = originPoint.x - width / 2;
    } else {
      x = position.overlayX == 'left' ? originPoint.x : (originPoint.x - width);
    }

    let y: number;
    if (position.overlayY == 'center') {
      y = originPoint.y - (height / 2);
    } else {
      y = position.overlayY == 'top' ? originPoint.y : (originPoint.y - height);
    }

    return { x, y };
  }

  /**
   * Gets the (x, y) coordinate of a connection point on the origin based on a relative position.
   */
  private _getOriginPoint(originRect: ClientRect, position: ConnectionPositionPair): Point {
    let x: number;
    if (position.originX == 'center') {
      x = originRect.left + (originRect.width / 2);
    } else {
      const startX = originRect.left;
      const endX = originRect.right;
      x = position.originX == 'left' ? startX : endX;
    }

    let y: number;
    if (position.originY == 'center') {
      y = originRect.top + (originRect.height / 2);
    } else {
      y = position.originY == 'top' ? originRect.top : originRect.bottom;
    }

    return { x, y };
  }

  /** Returns the ClientRect of the current origin. */
  private _getOriginRect(): ClientRect {
    const origin = this._origin;
    // Check for Element so SVG elements are also supported.
    if (origin instanceof Element) {
      return origin.getBoundingClientRect();
    }

    if (isRef(origin)) {
      const element = getElement(origin.value);
      if (element) {
        return element.getBoundingClientRect();
      } else {
        return {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: 0,
          width: 0,
        }
      }
    }

    const width = origin.width || 0;
    const height = origin.height || 0;

    // If the origin is a point, return a client rect as if it was a 0x0 element at the point.
    return {
      top: origin.y,
      bottom: origin.y + height,
      left: origin.x,
      right: origin.x + width,
      height,
      width
    };
  }

  private _caculateScroll(style: Ref<CSSProperties>, originPoint: Point) {
    const offsetX = window.pageXOffset;
    const offsetY = window.pageYOffset;
    this.subscribe = () => {
      if (this.isVisible) {
        const nowTop = this.window.pageYOffset;
        const nowLeft = this.window.pageXOffset;
        style.value.left = coerceCssPixelValue(originPoint.x - nowLeft + offsetX);
        style.value.top = coerceCssPixelValue(originPoint.y - nowTop + offsetY);
        // trigger change
        style.value = style.value;
      }
    }
    this.window.addEventListener('scroll', this.subscribe);
  }
}
