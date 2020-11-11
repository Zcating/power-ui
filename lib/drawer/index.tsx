import { computed, defineComponent, Prop, renderSlot, toRef, Transition } from "vue";
import { Enum, renderCondition } from '../cdk/utils';
import {vmodelRef} from '../cdk/hook';
import { Overlay } from '../cdk/overlay';

export type DrawerDirection = 'ltr' | 'rtl' | 'ttb' | 'btt';


export const Drawer = defineComponent({
  props: {
    appendToBody: {
      type: Boolean,
      default: false
    },
    beforeClose: {
      type: Function
    },
    customClass: {
      type: String,
      default: ''
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    direction: {
      type: Enum<DrawerDirection>(),
      default: 'rtl',
      validator(val: any) {
        return ['ltr', 'rtl', 'ttb', 'btt'].indexOf(val) !== -1;
      }
    } as Prop<DrawerDirection>,
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: '30%'
    },
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false,
    },
    wrapperClosable: {
      type: Boolean,
      default: true
    },
    withHeader: {
      type: Boolean,
      default: true
    }
  },

  setup(props, ctx) {
    const isHorizontal = computed(() => {
      const direction = props.direction;
      return direction === 'rtl' || direction === 'ltr';
    });

    const elVisible = vmodelRef(toRef(props, 'visible'), (value) => ctx.emit('update:visible', value ?? false));

    const closeDrawer = () => {
      elVisible.value = false;
    }

    return {
      elVisible,
      isHorizontal,
      closeDrawer,
    }
  },

  methods: {

  },

  render() {
    const {
      $slots,
      title,
      direction,
      customClass,
      isHorizontal,
      size,
      withHeader,
      showClose,
      closeDrawer,
    } = this;
    const animationClass = this.elVisible ? 'el-drawer__open' : '';

    return <Overlay v-model={[this.elVisible, 'visible']} backgroundBlock={true}>
      <Transition name="el-drawer-fade">
        <div
          aria-modal="true"
          aria-labelledby="el-drawer__title"
          aria-label={title}
          class={['el-drawer', animationClass, direction, customClass,]}
          style={isHorizontal ? `width: ${size}` : `height: ${size}`}
          ref="drawer"
          role="dialog"
          tabindex={-1}
        >
          {renderCondition(
            withHeader,
            <header class="el-drawer__header" id="el-drawer__title">
              {renderSlot($slots, 'title')}
              <span role="heading" tabindex={0} title={title}>{title}</span>
              {renderCondition(
                showClose,
                <button
                  aria-label={`close ${title || 'drawer'}`}
                  class="el-drawer__close-btn"
                  type="button"
                  onClick={closeDrawer}
                >
                  <i class="el-dialog__close el-icon el-icon-close" />
                </button>
              )}
            </header>
          )}
          <section class="el-drawer__body">
            {renderSlot($slots, 'default')}
          </section>
        </div>
      </Transition>
    </Overlay>
  }
});