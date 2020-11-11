import { addEvent } from '../cdk/utils';
import { computed, defineComponent, inject, isRef, onUnmounted, reactive, Ref, ref, toRefs } from 'vue';
import { renderThumbStyle, BAR_MAP, BarProps } from './utils';

function parentWrap(): Ref<HTMLElement | undefined> {
  let wrap: any = inject('el-scrollbar-wrap');
  if (!isRef(wrap)) {
    wrap = ref<HTMLElement>();
  }
  return wrap;
}

/* istanbul ignore next */
export const Bar = defineComponent({
  name: 'Bar',

  props: {
    vertical: Boolean,
    size: String,
    move: Number
  },

  setup(props) {

    const state = reactive({
      bar: computed<BarProps>(() => BAR_MAP[props.vertical ? 'vertical' : 'horizontal']),
      barEl: ref<HTMLElement>(),
      thumb: ref<HTMLElement>(),
      wrap: parentWrap(),
      X: ref(0),
      Y: ref(0),
      cursorDown: false,
    });


    let mouseMoveStop: { (): void; };
    let mouseUpStop: { (): void; };
    onUnmounted(() => {
      mouseUpStop?.();
    });

    // When clicking the bar, the thumb will move to
    const clickThumbHandler = (event: MouseEvent) => {
      // prevent click event of right button
      const { ctrlKey, button, currentTarget: target } = event;
      if (ctrlKey || button === 2 || !(target instanceof HTMLElement)) {
        return;
      }
      event.stopImmediatePropagation();
      
      const { bar: { axis, direction, offset, client } } = state;
      state.cursorDown = true;
      state[axis] = (target[offset] - (event[client] - target.getBoundingClientRect()[direction]));

      mouseMoveStop = addEvent(document, 'mousemove', (event) => {
        const {
          thumb,
          barEl,
          wrap,
          cursorDown,
          bar: { axis, direction, client, offset, scroll, scrollSize },
          [axis]: prevPage
        } = state;

        if (!(thumb && wrap && barEl && prevPage && cursorDown)) {
          return;
        }

        const elOffset = ((event[client] - barEl.getBoundingClientRect()[direction]));
        const thumbClickPosition = (thumb[offset] - prevPage);
        const thumbPositionPercentage = ((elOffset - thumbClickPosition) * 100 / barEl[offset]);

        wrap[scroll] = (thumbPositionPercentage * wrap[scrollSize] / 100);
      });

      mouseUpStop = addEvent(document, 'mouseup', () => {
        state.cursorDown = false;
        state[state.bar.axis] = 0;
        mouseMoveStop?.();
        document.onselectstart = null;
      });

      document.onselectstart = () => false;
    }

    const clickTrackHandler = (event: MouseEvent) => {
      const { thumb, barEl, wrap, bar: { direction, client, offset, scroll, scrollSize } } = state;
      const div = event.target! as HTMLDivElement;

      if (!(thumb && wrap && barEl)) {
        return;
      }
      const divOffset = Math.abs(div.getBoundingClientRect()[direction] - event[client]);
      const thumbHalf = (thumb[offset] / 2);
      const thumbPositionPercentage = ((divOffset - thumbHalf) * 100 / barEl[offset]);

      wrap[scroll] = (thumbPositionPercentage * wrap[scrollSize] / 100);
    };

    return { 
      ...toRefs(state), 
      clickThumbHandler, 
      clickTrackHandler 
    };
  },


  render() {
    const { size, move, bar, clickTrackHandler, clickThumbHandler } = this;

    return (
      <div
        ref="barEl"
        class={['el-scrollbar__bar', 'is-' + bar.key]}
        onMousedown={clickTrackHandler}
      >
        <div
          ref="thumb"
          class="el-scrollbar__thumb"
          onMousedown={clickThumbHandler}
          style={renderThumbStyle({ size, move, bar })}>
        </div>
      </div>
    );
  },
});
