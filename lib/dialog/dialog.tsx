import { vmodelRef } from '../cdk/hook';
import { defineComponent, renderSlot, toRef, Transition, watch } from "vue";
import { Overlay, GlobalPositionStrategy, provideStrategy } from '../cdk';
import '../theme-chalk/src/dialog.scss';
export default defineComponent({
  props: {
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
  setup(props, ctx) {
    const visible = vmodelRef(toRef(props, 'visible'), (value) => {
      ctx.emit('update:visible', value);
    });

    const hide = () => {
      visible.value = false;
    }

    const handleClose = () => {
      if (typeof props.beforeClose === 'function') {
        props.beforeClose(hide);
      } else {
        hide();
      }
    }

    provideStrategy(new GlobalPositionStrategy().centerX().centerY());

    return () => {
      const center = props.center ? 'el-dialog--center' : '';
      const footer = ctx.slots['footer'] ? (
        <div class="el-dialog__footer">
          {renderSlot(ctx.slots, 'footer')}
        </div>
      ) : undefined;
      return (
        <Overlay 
          visible={visible.value} 
          backdropClick={hide}
          backgroundBlock={true}
        >
          <Transition name="el-dialog-fade">
            <div
              v-show={visible.value}
              aria-modal="true"
              aria-label={props.title || 'dialog'}
              class={`el-dialog ${props.customClass} ${center}`}
              style={`${props.style}`}
            >
              <div class="el-dialog__header">
                <span class="el-dialog__title">{props.title}</span>
                {renderSlot(ctx.slots, 'title')}
                <button
                  type="button"
                  class="el-dialog__headerbtn"
                  aria-label="Close"
                  v-show={props.showClose || true}
                  onClick={handleClose}
                >
                  <i class="el-dialog__close el-icon el-icon-close"></i>
                </button>
              </div>
              <div class="el-dialog__body">
                {renderSlot(ctx.slots, 'default')}
              </div>
              {footer}
            </div>
          </Transition>
        </Overlay>
      );
    }
  }
});
