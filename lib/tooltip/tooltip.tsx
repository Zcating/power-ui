import { vmodelRef } from '../cdk/hook';
import { ESCAPE } from '../cdk/keycodes';
import { cloneVNode, computed, defineComponent, VNode, Transition, CSSProperties, inject, onUnmounted, ref, toRef, watch } from 'vue';
import { platformToken } from '..';
import { FlexiblePositionStrategy, Overlay, provideStrategy } from '../cdk';
import { addEvent, Enum, getElement, isValidElement, List, Model, renderCondition } from '../cdk/utils';
import { ArrowPlacement, OVERLAY_POSITION_MAP, Placement, TriggerType } from './types';

let tooltipCounter = 0;

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
      type: Enum<Placement>(),
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
      type: Enum<'dark' | 'light'>(),
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
    trigger: {
      type: Enum<TriggerType>(),
      default: 'hover'
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const visible = vmodelRef(toRef(props, 'modelValue'), (value) => ctx.emit('update:modelValue', value));
    const referenceRef = ref<HTMLElement | null>(null);
    const popperRef = ref<HTMLElement | null>(null);
    const strategy = new FlexiblePositionStrategy(referenceRef);

    watch(
      () => props.placement,
      (value) => {
        strategy.positionPair(OVERLAY_POSITION_MAP[value]);
      },
      { immediate: true }
    );
    provideStrategy(strategy);


    const tooltipId = `el-tooltip-${tooltipCounter++}`;

    const airaHidden = computed(() => props.disabled ? 'true' : 'false');

    // get placement
    const arrowPlacement = computed(() => (props.placement.match(/(top|left|bottom|right)/)?.[0] || 'top') as ArrowPlacement);

    // set the arrow's position
    const arrowStyle = computed(() => {
      const alignment = props.placement.match(/(start|end)/)?.[0] || 'center';
      if (alignment == 'center') {
        switch (arrowPlacement.value) {
          case 'top':
          case 'bottom':
            return { left: '50%', transform: 'translateX(-50%)' };
          case 'left':
          case 'right':
            return { top: '50%', transform: 'translateY(-50%)' };
        }
      } else {
        switch (arrowPlacement.value) {
          case 'top':
          case 'bottom':
            const horizontal = alignment === 'start' ? 'left' : 'right';
            return { [horizontal]: `${props.arrowOffset || 8}px` };
          case 'left':
          case 'right':
            const vertical = alignment === 'start' ? 'top' : 'bottom';
            return { [vertical]: `${props.arrowOffset || 8}px` };
        }
      }
    });

    const destroyFns: (() => void)[] = [];

    const triggerRef = toRef(props, 'trigger');

    const doc = inject(platformToken)?.TOP?.document;

    watch(() => [referenceRef.value, popperRef.value, triggerRef.value], (values) => {
      const reference = values[0] as HTMLElement;
      const popper = values[1] as HTMLElement;
      const trigger = values[2] as TriggerType;
      if (!(reference && popper && doc)) {
        return;
      }
      // clear all listeners
      destroyFns.forEach(fn => fn());
      destroyFns.splice(0, destroyFns.length - 1);

      const show = () => { visible.value = true; };
      const close = () => { visible.value = false; };

      reference.setAttribute('aria-describedby', tooltipId);
      reference.setAttribute('tabindex', `${props.tabindex}`);

      popper.setAttribute('tabindex', '0');

      if (trigger === 'click') {
        destroyFns.push(
          addEvent(reference, 'click', show),
          addEvent(reference, 'keydown', (e) => e.keyCode === ESCAPE && close()),
          addEvent(doc, 'click', (e) => {
            if (!visible.value) {
              return;
            }
            const target = e.target as HTMLElement;
            const isContain = reference.contains(target) || popper.contains(target);
            if (!isContain) {
              close();
            }
          })
        );
      } else if (trigger === 'click-close') {
        destroyFns.push(
          addEvent(reference, 'click', () => visible.value = !visible.value),
          addEvent(reference, 'keydown', (e) => e.keyCode === ESCAPE && close()),
          addEvent(doc, 'click', (e) => {
            if (!visible.value) {
              return;
            }
            const target = e.target as HTMLElement;
            const isContain = reference.contains(target) || popper.contains(target);
            if (!isContain) {
              close();
            }
          })
        );
      } else if (trigger === 'focus') {
        if (props.tabindex < 0) {
          console.warn('[Element Warn][Popover]a negative taindex means that the element cannot be focused by tab key');
        }
        destroyFns.push(
          addEvent(reference, 'focusin', show),
          addEvent(reference, 'focusout', close),
        );
      } else if (trigger === 'hover') {
        destroyFns.push(
          addEvent(reference, 'mouseenter', show),
          addEvent(reference, 'mouseleave', close),
          addEvent(popper, 'mouseenter', show),
          addEvent(popper, 'mouseleave', close)
        );
      } else if (trigger === 'custom') {
      }
    });

    onUnmounted(() => destroyFns.forEach(value => value()));

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
      arrowStyle,
      arrowPlacement,
      airaHidden,
      tooltipId,
      visible,
      popper: popperRef,
      reference: referenceRef,
    };
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

    let node: VNode | VNode[] | undefined = slots.default?.();
    if (node) {
      // set the reference
      const setReference = (ref: any) => {
        this.reference = getElement(ref);
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
              {slots.content ? slots.content?.() : <span>{content}</span>}
              {renderCondition(visibleArrow, <div x-arrow class="popper__arrow" style={arrowStyle}></div>)}
            </div>
          </Transition>
        </Overlay>
      </>
    );
  }
});