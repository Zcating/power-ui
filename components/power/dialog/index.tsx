import { watchRef } from 'vue-cdk/hook';
import { Transition, defineComponent, toRef } from 'vue';
import { GlobalPositionStrategy, Overlay, provideStrategy } from 'vue-cdk';
export const Dialog = defineComponent({
  props: {
    id: String,
    visible: {
      type: Boolean,
      default: false,
    },
    // key: String,
    title: {
      type: String,
      default: '',
    },
    modal: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: ''
    },
    center: {
      type: Boolean,
      default: false
    },
    style: {
      type: String,
      default: ''
    },
    showClose: Boolean,
    beforeClose: Function,
    width: String,
  },
  emits: [
    'update:visible'
  ],
  setup(props, ctx) {
    const visible = watchRef(toRef(props, 'visible'), (value) => {
      ctx.emit('update:visible', value);
    });

    const hide = () => {
      visible.value = false;
    };

    const handleClose = () => {
      if (typeof props.beforeClose === 'function') {
        props.beforeClose(hide);
      } else {
        hide();
      }
    };

    provideStrategy(new GlobalPositionStrategy().centerX().centerY());

    return () => {
      return (
        <Overlay
          visible={visible.value}
          backdropClick={hide}
          backgroundBlock={true}
        >
          <Transition name="el-dialog-fade">
            <div
              id={props.id}
              v-show={visible.value}
              aria-modal="true"
              aria-label={props.title || 'dialog'}
              class={['el-dialog', props.customClass, { 'el-dialog--center': props.center }]}
              style={`${props.style}`}
            >
              <div class="el-dialog__header">
                <span class="el-dialog__title">{props.title}</span>
                {ctx.slots.title?.()}
                <button
                  type="button"
                  class="el-dialog__headerbtn"
                  aria-label="Close"
                  v-show={props.showClose || true}
                  onClick={handleClose}
                >
                  <i class="el-dialog__close el-icon el-icon-close" />
                </button>
              </div>
              <div class="el-dialog__body">
                {ctx.slots.default?.()}
              </div>
              {ctx.slots.footer ? (
                <div class="el-dialog__footer">
                  {ctx.slots.footer()}
                </div>
              ) : undefined}
            </div>
          </Transition>
        </Overlay>
      );
    };
  }
});
