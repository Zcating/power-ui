import { defineComponent, renderSlot } from 'vue';
import { renderCondition } from 'vue-cdk/utils';
import { useVirtualScroll } from './virtual-scrollable';

export const VirtualScroll = defineComponent({
  name: 'cdk-virtual-scroll',
  inheritAttrs: false,

  props: {
    maxScroll: {
      type: Boolean,
      default: false,
    }
  },

  setup(props, ctx) {
    const virtualScroll = useVirtualScroll();
    if (!virtualScroll) {
      throw Error('You should new a virtualScrollable first');
    }

    return () => (
      <div
        style={{ position: 'relative', overflow: 'auto' }}
        ref={virtualScroll.containerRef}
        {...ctx.attrs}
      >

        {props.maxScroll ? <div style={{ height: virtualScroll.totalHeight + 'px' }} /> : null}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            left: 0,
            top: virtualScroll.beforeHeight + 'px',
          }}
        >
          {renderSlot(ctx.slots, 'default')}
        </div>
      </div>
    );
  },
});
