import { defineComponent, computed, renderSlot, Transition, VNode, cloneVNode } from 'vue';
import { Overlay } from '../cdk/overlay';
import { Enum, getElement, isValidElement } from '../cdk/utils';
import { Placement, TriggerType, useTooltip } from '../tooltip';

export const Popover = defineComponent({
  name: 'el-popover',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 150
    },
    placement: {
      type: Enum<Placement>(),
      default: 'top',
    },
    trigger: {
      type: Enum<TriggerType>(),
      default: 'click',
    },
    visibleArrow: {
      type: Boolean,
      default: true,
    },
    arrowOffset: {
      type: Number,
      default: 8,
    },
    tabindex: {
      type: Number,
      default: 0
    },
    enterable: {
      type: Boolean,
      default: false
    },
    transition: {
      type: String,
      default: 'el-fade-in-linear'
    },
    popperClass: String,
  },
  setup(props, ctx) {
    const state = useTooltip(props, ctx, props.trigger);

    const popoverClass = computed(() => {
      const clazz = ['el-popover', 'el-popper'];
      if (props.popperClass) {
        clazz.push(props.popperClass);
      }
      if (props.content) {
        clazz.push('el-popover--plain');
      }
      return clazz;
    });

    return {
      eltype: 'popover',
      popoverClass,
      ...state
    }
  },

  render() {
    const {
      $slots: slots,
      title,
      width,
      content,
      arrowStyle,
      arrowPlacement,
      popoverClass,
      airaHidden,
      visible,
      transition,
    } = this;

    let node: VNode | VNode[] | undefined = slots.default?.();
    if (node) {
      // set the reference
      const setReference = (ref: any) => {
        this.reference = getElement(ref)
      };
      // get the node
      node = node.length === 1 ? node[0] : node;
      if (isValidElement(node)) {
        // create a new node to set the reference
        node = cloneVNode(node as VNode, { ref: setReference }, true);
      } else {
        // set a wrapper dom for the node.
        node = (<span ref={setReference}>{node}</span>) as VNode;
      }
    }

    return (
      <>
        {node}
        <Overlay visible={visible} hasBackdrop={false}>
          <Transition name={transition}>
            <div
              ref="popper"
              v-show={visible}
              class={popoverClass}
              style={{ width: `${width}px` }}
              aria-hidden={airaHidden}
              x-placement={arrowPlacement}
            >
              <div class="el-popover__title">{title}</div>
              {slots.content ? renderSlot(slots, 'content') : (<div>{content}</div>)}
              <div x-arrow class="popper__arrow" style={arrowStyle}></div>
            </div>
          </Transition>
        </Overlay>
      </>
    );
  }
});
