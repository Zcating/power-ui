import { CSSProperties } from 'vue';

export type BarProps = (typeof BAR_MAP.horizontal) | (typeof BAR_MAP.vertical);

 export const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top'
  } as const,
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left'
  } as const
};

export function renderThumbStyle({ move, size, bar }: { move?: number, size?: string, bar: BarProps }) {
  const style: CSSProperties = {};
  const translate = `translate${bar.axis}(${move}%)`;

  style[bar.size] = size;
  style.transform = translate;
  style.msTransform = translate;
  style.WebkitTransform = translate;

  return style;
}


let _scrollBarWidth: number;

export default function scrollBarWidth() {
  if (_scrollBarWidth !== undefined) return _scrollBarWidth;

  const outer = document.createElement('div');
  outer.className = 'el-scrollbar__wrap';
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode!.removeChild(outer);
  _scrollBarWidth = widthNoScroll - widthWithScroll;

  return _scrollBarWidth;
}
