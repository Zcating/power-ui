import { inject, Plugin } from 'vue';
import { Notification } from './notification';
import { $notification, $notificationImpl, NotificationServiceImpl } from './notification.service';


export const useNotification = () => {
  const notification = inject($notification);
  if (!notification) {
    throw Error('[error][power-ui]: please make sure you have added notification plugin.');
  }
  return notification;
};

export const notification: Plugin = {
  install(app) {
    const service = new NotificationServiceImpl();
    app.provide($notification, service);
    app.provide($notificationImpl, service);
    app.mixin({
      inject: {
        '$notify': $notification as symbol,
      }
    });
    app.component(Notification.name, Notification);
  }
};
