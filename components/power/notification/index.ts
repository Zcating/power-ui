import { inject, Plugin } from 'vue';
import { Notification } from './notification';
import { $notification, $notificationImpl, NotificationServiceImpl } from './notification.service';

export const useNotification = () => inject($notification)!;


export const notification: Plugin = {
  install(app) {
    const service = new NotificationServiceImpl();
    app.provide($notification, service);
    app.provide($notificationImpl, service);
    app.component(Notification.name, Notification);
  }
};
