import { CSSProperties, ComponentPublicInstance, Ref, isRef, ref, onMounted, onUpdated, onUnmounted, watch, nextTick, getCurrentInstance, shallowReactive, reactive, readonly } from 'vue';
import { ConnectionPosition, ConnectionPositionPair, HorizontalConnectionPos, VerticalConnectionPos } from './types';
import { OverlayProps, PositionStrategy } from './position-strategy';
import { coerceCssPixelValue } from '../../coercion';
import { getElement, thenable } from '../../utils';
import { usePlatform } from '../../platform';
import { ResizeObserver } from '@juggle/resize-observer';
interface Point {
  x: number;
  y: number;
}

export type FlexiblePositionOrigin = Element | Ref<ComponentPublicInstance | Element | undefined | null> | (Point & {
  width?: number;
  height?: number;
});

type FlexibleOrigin = Element | (Point & {
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

  private readonly window: Window;

  constructor(
    private _origin: FlexiblePositionOrigin,
  ) {
    super();
    const window = usePlatform().TOP;
    if (!window) {
      throw Error('window is null');
    }
    this.window = window;
  }

  setup(panelRef: Ref<HTMLElement | null>, visible: Ref<boolean>): OverlayProps {
    const positionedStyle = ref<CSSProperties>({ position: 'absolute' });
    // pass instance
    const instance = getCurrentInstance();
    onMounted(async () => {
      await nextTick();

      const panel = panelRef.value;
      if (!panel) {
        return;
      }
      const originOrPoint = this.getOriginOrPoint();
      if (!originOrPoint) {
        return;
      }

      if (originOrPoint instanceof Element) {
        let left = originOrPoint.getBoundingClientRect().left;
        onUpdated(() => {
          if (visible.value) {
            const other = originOrPoint.getBoundingClientRect().left;
            if (left !== other) {
              handleChange();
              left = other;
            }
          }
        }, instance);
      }

      const observer = new ResizeObserver((entries) => {
        // TODO: add optimize for throttle
        const point = this._calculatePosition(entries[0].contentRect, originOrPoint);
        // set the current position style's value.
        // the current position style is a 'ref'. 
        const style = positionedStyle.value;
        style.left = coerceCssPixelValue(point.x);
        style.top = coerceCssPixelValue(point.y);
      });
      observer.observe(panel);

      const handleChange = () => {
        // TODO: add optimize for throttle
        const point = this._calculatePosition(panel, originOrPoint);
        // set the current position style's value.
        // the current position style is a 'ref'. 
        const style = positionedStyle.value;
        style.left = coerceCssPixelValue(point.x);
        style.top = coerceCssPixelValue(point.y);
      };

      watch(visible, (value) => {
        if (value) {
          this.subscribe(handleChange);
        } else {
          this.unsubscribe(handleChange);
        }
      });
      onUnmounted(() => {
        this.unsubscribe(handleChange);
        observer.disconnect();
      }, instance);
    }, instance);

    return readonly({
      positionedStyle,
      containerStyle: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh'
      }
    });
  }

  subscribe(event: (e?: Event) => void): void {
    // at last, we need to caculate the position
    // when scrolling.
    const { window } = this;
    window.addEventListener('scroll', event, true);
    window.addEventListener('resize', event);
    window.addEventListener('orientationchange', event);
  }

  unsubscribe(event: (e?: Event) => void) {
    const { window } = this;
    window.removeEventListener('scroll', event, true);
    window.removeEventListener('resize', event);
    window.removeEventListener('orientationchange', event);
  }

  /**
   * Sets the origin of the overlay.
   * 
   * @param value New origin.
   */
  origin(value: FlexiblePositionOrigin) {
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
      );
    }
    return this;
  }

  private _calculatePosition(panelOrRect: HTMLElement | DOMRect, origin: FlexibleOrigin): Point {
    // get overlay rect
    const originRect = this._getOriginRect(origin);

    // calculate the origin point
    const originPoint = this._getOriginPoint(originRect, this._positionPair);

    let rect;
    if (panelOrRect instanceof HTMLElement) {
      rect = panelOrRect.getBoundingClientRect();
    } else {
      rect = panelOrRect;
    }

    // calculate the overlay anchor point
    return this._getOverlayPoint(originPoint, this._positionPair, rect);
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
  private _getOriginRect(origin: FlexibleOrigin): ClientRect {
    if (origin instanceof Element) {
      return origin.getBoundingClientRect();
    }
    // Origin is point
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

  private getOriginOrPoint() {
    const origin = this._origin;

    // Check for Element so SVG elements are also supported.
    if (origin instanceof Element) {
      return origin;
    }

    if (isRef(origin)) {
      return getElement(origin.value);
    }

    return origin;
  }
}
