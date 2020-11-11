import { Overlay } from '../cdk';
import { computed, defineComponent, InjectionKey, Ref } from 'vue';
import { Notification } from './notification';
import { NotificationConfig, NotificationData, NotificationPosition, positionClassTag } from './types';

export const notificationDataKey = Symbol() as InjectionKey<Ref<Required<NotificationData>[]>>;


/*
 * 'props' will transform all properties to proxy. 
 * This will cause some problem, so use function to
 * prevent it.
 */
export default (
  config$: Ref<NotificationConfig>,
  datas: Ref<Required<NotificationData>[]>,
  onDestroy: (id: string) => void
) => defineComponent({
  name: 'el-notification-container',
  setup() {
    const config = config$.value;

    const visible = computed(() => datas.value.length > 0);

    const createNotifications = (position: NotificationPosition) => {
      const _datas = datas.value; 
      const tag = positionClassTag[position];
      const verticalProperty = position.indexOf('top') > -1 ? 'top' : 'bottom';
      const targets = _datas.filter(value => value.position === position);
      return targets.length > 0 ? (
        <div
          class={`el-notification-container el-notification-container__${tag}`}
          style={{ [verticalProperty]: `${config.offset}px` }}
        >
          {...targets.map((value) => (
            <Notification
              {...value}
              key={value.notificationId}
              onDestroy={onDestroy}
            ></Notification>
          ))}
        </div>
      ) : undefined;
    }


    return () => {
      const tls = createNotifications('top-left');
      const trs = createNotifications('top-right');
      const bls = createNotifications('bottom-left');
      const brs = createNotifications('bottom-right');
      return (
        <Overlay visible={visible.value} hasBackdrop={false}>
          {trs}
          {tls}
          {bls}
          {brs}
        </Overlay>
      )
    }
  }
});
