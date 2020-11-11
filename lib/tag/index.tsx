import { ElSize } from '../types';
import { computed, defineComponent, Prop, Transition } from 'vue';
import { Enum, Method, renderCondition } from '../cdk/utils';

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
      validator(val: any) {
        return ['dark', 'light', 'plain'].indexOf(val) !== -1;
      }
    } as Prop<TagEffect>,

    onClose: Method<(e: Event)=>void>(),
    onClick: Method<(e: Event)=>void>(),
  },

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

    const tagSize = computed(() => props.size);

    return {
      handleClose: handleClose,
      handleClick: handleClick,
      tagSize,
    }
  },
  render() {
    const {
      $slots,
      type,
      tagSize,
      hit,
      effect,
      disableTransitions,
      color,
      closable,
      handleClose,
      handleClick
    } = this;
    const classes = [
      'el-tag',
      type ? `el-tag--${type}` : '',
      tagSize ? `el-tag--${tagSize}` : '',
      effect ? `el-tag--${effect}` : '',
      hit && 'is-hit'
    ];
    const tagEl = (
      <span
        class={classes}
        style={{ backgroundColor: color }}
        onClick={handleClick}
      >
        {$slots.default?.()}
        {closable && <i class="el-tag__close el-icon-close" onClick={handleClose}></i>}
      </span>
    );
    return renderCondition(
      disableTransitions,
      tagEl,
      <Transition name="el-zoom-in-center">{tagEl}</Transition>
    );
  }
});
