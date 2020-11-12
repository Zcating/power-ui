import { cloneVNode, computed, defineComponent, renderSlot, VNode, Transition, CSSProperties } from 'vue';
import { Overlay } from '../cdk';
import { Enum, getElement, isValidElement, List, Model, renderCondition } from '../cdk/utils';
import { Placement, TriggerType } from './types';
import { useTooltip } from './use-tooltip';

export const Tooltip = defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: '',
    },
    placement: {
      type: String as () => Placement,
      default: 'top',
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
    effect: {
      type: String as () => 'dark' | 'light' | undefined,
      default: 'dark'
    },
    transition: {
      type: String,
      default: 'el-fade-in-linear',
    },
    popperClass: {
      type: [String, List<string>()],
      default: 'el-tooltip__popper',
    },
    popperStyle: {
      type: [String, Model<CSSProperties>()],
      default: ''
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    trigger: {
      type: Enum<TriggerType>(),
      default: 'hover'
    },
  },
  setup(props, ctx) {
    const state = useTooltip(props, ctx, props.trigger);

    const popoverClass = computed(() => {
      const { popperClass } = props;
      const clazz = Array.isArray(popperClass) ? [...popperClass] : [popperClass];
      if (props.effect) {
        clazz.push(`is-${props.effect}`);
      }
      return clazz;
    });

    return {
      eltype: 'tooltip',
      popoverClass,
      ...state,
    }
  },

  render() {
    const {
      $slots: slots,
      arrowStyle,
      arrowPlacement,
      popoverClass,
      popperStyle,
      airaHidden,
      content,
      tooltipId,
      visibleArrow,
      visible,
      transition,
    } = this;


    let node: VNode | VNode[] | undefined = slots.reference?.();
    if (node) {
      // set the reference
      const setReference = (ref: any | null) => {
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
        <Overlay v-model={[this.visible, 'visible']} hasBackdrop={false}>
          <Transition name={transition}>
            <div
              v-show={visible}
              ref="popper"
              role="tooltip"
              id={tooltipId}
              aria-hidden={airaHidden}
              class={popoverClass}
              style={popperStyle}
              x-placement={arrowPlacement}
            >
              {renderCondition(slots.default, renderSlot(slots, 'default'), <span>{content}</span>)}
              {renderCondition(visibleArrow, <div x-arrow class="popper__arrow" style={arrowStyle}></div>)}
            </div>
          </Transition>
        </Overlay>
      </>
    );
  }
});