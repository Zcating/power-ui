import { Popover } from '../popover';
import { defineComponent, toRef } from 'vue';
import { Button, ElButtonType } from '../button';
import "../theme-chalk/src/popconfirm.scss";
import { Placement } from '@/tooltip';
import { vmodelRef } from '../cdk/hook';

export const Popconfirm = defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    icon: String,
    hideIcon: Boolean,
    title: String,
    iconColor: {
      type: String,
      default: 'white',
    },
    cancelButtonType: {
      type: String as () => ElButtonType,
      default: 'default',
    },
    cancelButtonText: {
      type: String,
      default: 'cancel',
    },
    confirmButtonType: {
      type: String as () => ElButtonType,
      default: 'primary',
    },
    confirmButtonText: {
      type: String,
      default: 'confirm',
    },
    placement: {
      type: String as () => Placement,
      default: 'top-start'
    },
    confirm: Function,
    cancel: Function,
  },
  setup(props, ctx) {
    const visible = vmodelRef(toRef(props, 'modelValue'), (value) => {ctx.emit('update:modelValue', value)});
    
    const cancel = () => {
      visible.value = false;
      props.cancel?.();
    }
    const confirm = () => {
      visible.value = false;
      props.confirm?.();
    }
    return {
      eltype: 'popconfirm',
      cancel,
      confirm,
      visible,
    }
  },
  render() {
    const {
      icon,
      hideIcon,
      title,
      cancelButtonText,
      cancelButtonType,
      cancel,
      confirmButtonText,
      confirmButtonType,
      confirm,
      iconColor,
      placement,
    } = this;

    const slots = {
      default: this.$slots.default,
      content: () => (
        <div class="el-popconfirm">
          <p class="el-popconfirm__main">
            <i
              v-show={!hideIcon}
              class={["el-popconfirm__icon", icon]}
              style={{ color: iconColor }}
            ></i>
            {title}
          </p>
          <div class="el-popconfirm__action">
            <Button
              size="mini"
              type={cancelButtonType}
              onClick={cancel}
            >
              {cancelButtonText}
            </Button>
            <Button
              size="mini"
              type={confirmButtonType}
              onClick={confirm}
            >
              {confirmButtonText}
            </Button>
          </div>
        </div>
      )
    }
    return (<Popover 
      v-model={this.visible}
      ref="popover" 
      v-slots={slots} 
      trigger="click" 
      // title={title}
      placement={placement} 
    />);
  }
});