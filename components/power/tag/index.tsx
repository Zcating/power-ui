import { ElSize } from '../types';
import { Transition, computed, defineComponent } from 'vue';
import { Enum, Method, renderCondition } from 'vue-cdk/utils';

export type TagEffect = 'dark' | 'light' | 'plain';

export type TagType = 'success' | 'info' | 'danger' | 'warning';

export const Tag = defineComponent({
  name: 'el-tag',
  props: {
    text: String,
    closable: Boolean,
    hit: Boolean,
    disableTransitions: Boolean,
    color: String,
    type: Enum<TagType>(),
    size: Enum<ElSize>(),
    effect: {
      type: Enum<TagEffect>(),
      default: 'light',
      validator: (val: any) => {
        return ['dark', 'light', 'plain'].indexOf(val) !== -1;
      }
    },
    onClose: Method<(e: Event) => void>(),
    onClick: Method<(e: Event) => void>(),
  },
  // emits: {
  //   'close': (event: Event) => true,
  //   'click': (event: Event) => true
  // },
  setup(props, ctx) {
    function handleClose(event: Event) {
      event.stopPropagation();
      props.onClose?.(event);
      // ctx.emit('close', event);
    }
    function handleClick(event: Event) {
      props.onClick?.(event);
      // ctx.emit('click', event);
    }

    const tagSizeRef = computed(() => props.size);

    return () => {
      const {
        type,
        effect,
        hit,
        color,
        closable,
        disableTransitions,
        text
      } = props;
      const tagSize = tagSizeRef.value;

      const tagEl = (
        <span
          class={[
            'el-tag',
            type ? `el-tag--${type}` : '',
            tagSize ? `el-tag--${tagSize}` : '',
            effect ? `el-tag--${effect}` : '',
            hit ? 'is-hit' : ''
          ]}
          style={{ backgroundColor: color }}
          onClick={handleClick}
        >
          {ctx.slots.default ? ctx.slots.default() : text}
          {renderCondition(closable, <i class="el-tag__close el-icon-close" onClick={handleClose} />)}
        </span>
      );
      return renderCondition(
        disableTransitions,
        tagEl,
        <Transition name="el-zoom-in-center">{tagEl}</Transition>
      );
    };
  }
});
