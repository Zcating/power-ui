import { App, inject, Plugin } from 'vue';
import { Message } from './message';
import { $message, $messageImpl, MessageServiceImpl } from './message.service';
export const useMessage = () => inject($message)!;

export const message: Plugin = {
  install(app: App) {
    const messageService = new MessageServiceImpl();
    app.provide($message, messageService);
    app.provide($messageImpl, messageService);
    app.component(Message.name, Message);
  }
};
