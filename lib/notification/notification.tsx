import { computed, defineComponent, onMounted, ref, renderSlot, Transition } from 'vue';
import { notificationProps } from './types';
import { CdkTimer } from '../cdk/utils';


const typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
};

export const Notification = defineComponent({
  props: { ...notificationProps, onDestroy: Function, visible: { type: Boolean, default: false } },
  setup(props, ctx) {
    const {
      notificationId,
      message,
      title,
      type,
      showClose,
      position,
      onDestroy,
      duration,
      onClick,
      onClose,
    } = props;

    const visible = ref(false);
    onMounted(() => {
      visible.value = true;
    });

    const timer = duration > 0 ? new CdkTimer(() => close(), duration).start() : undefined;


    const click = (e: Event) => {
      if (typeof onClick === 'function') {
        onClick(e);
      }
    };

    const close = () => {
      visible.value = false;
      setTimeout(() => {
        onDestroy?.(notificationId);
      }, 300);
      if (typeof onClose === 'function') {
        onClose();
      }
    }

    const typeClass = computed(() => {
      return type ? `el-icon-${typeMap[type]}` : '';
    });

    const groupClass = computed(() => {
      const clazz = ['el-notification__group'];
      if (!!typeClass) {
        clazz.push('is-with-icon');
      }
      return clazz;
    });

    const panelClass = computed(() => {
      const horizontal = position.indexOf('right') > -1 ? 'right' : 'left';
      const vertical = position.indexOf('top') > -1 ? 'top' : 'bottom';
      const animationClass = visible.value ?
        `el-notification-fade-${horizontal}` :
        `el-notification-fade-leave-${vertical}`;

      return ['el-notification', animationClass, horizontal, vertical];
    });

    return () => {
      const icon = type ? (
        <i class={['el-notification__icon', typeClass]}></i>
      ) : undefined;

      const closeIcon = showClose ? (
        <div
          class="el-notification__closeBtn el-icon-close"
          onClick={close}
        ></div>
      ) : undefined;

      return (
        <Transition>
          <div
            v-show={visible.value}
            class={panelClass.value}
            onMouseenter={() => timer?.end()}
            onMouseleave={() => timer?.start()}
            onClick={click}
            role="alert"
          >
            {icon}
            <div class={groupClass.value}>
              <h2 class="el-notification__title">{title}</h2>
              <div class="el-notification__content" v-show={!!message}>
                {renderSlot(ctx.slots, 'default')}
                <p>{message}</p>
              </div>
              {closeIcon}
            </div>
          </div>
        </Transition>
      );
    };
  }
});
