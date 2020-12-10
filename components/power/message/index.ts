import { App, inject, Plugin } from 'vue';
import { Message } from './message';
import { $message, $messageImpl, MessageServiceImpl } from './message.service';

// setup only
export const useMessage = () => {
  const message = inject($message);
  if (!message) {
    throw Error('[error][power-ui]: please make sure you have added message plugin.');
  }
  return message;
};

export const message: Plugin = {
  install(app: App) {
    const messageService = new MessageServiceImpl();
    app.provide($message, messageService);
    app.provide($messageImpl, messageService);
    app.component(Message.name, Message);
    app.mixin({ inject: { '$message': $message as symbol } });
  }
};
