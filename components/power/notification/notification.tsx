import { Overlay } from 'vue-cdk';
import { computed, defineComponent, inject } from 'vue';
import { NotificationItem } from './notification-item';
import { NotificationPosition, positionClassTag } from './types';
import { $notificationImpl } from './notification.service';


/**
 * @component Notification
 * 
 * @name po-notification & PoNotification
 * 
 * @description 
 * TODO: add description
 * 
 */
export const Notification = defineComponent({
  name: 'po-notification',
  setup() {
    const service = inject($notificationImpl)!;

    const visible = computed(() => service.datas.length > 0);

    const createNotifications = (position: NotificationPosition) => {
      const _datas = service.datas;
      const tag = positionClassTag[position];
      const verticalProperty = position.indexOf('top') > -1 ? 'top' : 'bottom';
      const targets = _datas.filter(value => value.position === position);
      return targets.length > 0 ? (
        <div
          class={`el-notification-container el-notification-container__${tag}`}
          style={{ [verticalProperty]: `${service._config.offset}px` }}
        >
          {...targets.map((value) => (
            <NotificationItem
              {...value}
              key={value.notificationId}
              onDestroy={service.close}
            ></NotificationItem>
          ))}
        </div>
      ) : undefined;
    };


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
      );
    };
  }
});
