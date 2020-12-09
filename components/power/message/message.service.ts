import { InjectionKey, shallowRef } from 'vue';
import { MessageData, MessageDataOptions } from './types';

let _$counter = 0;

export const $message = Symbol() as InjectionKey<MessageService>;
export const $messageImpl = Symbol() as InjectionKey<MessageServiceImpl>;

export abstract class MessageService {

  info(content: string, options?: MessageDataOptions): void {
    this.create({ type: 'info', content, options });
  }

  error(content: string, options?: MessageDataOptions): void {
    this.create({ type: 'error', content, options });
  }

  warning(content: string, options?: MessageDataOptions): void {
    this.create({ type: 'warning', content, options });
  }

  abstract closeAll(): void;

  protected getInstanceId(): string {
    return `eleMessage-${++_$counter}`;
  }

  protected abstract create(data: MessageData): void;
}

export class MessageServiceImpl extends MessageService {
  private instances = shallowRef<Required<MessageData>[]>([]);

  get datas() {
    return this.instances.value;
  }

  closeAll(): void {
    this.instances.value = [];
  }

  protected create(data: MessageData) {
    const messageData = {
      type: data.type || 'info',
      iconClass: data.iconClass ?? '',
      options: {},
      content: data.content ?? '',
      messageId: this.getInstanceId(),
      createdAt: new Date()
    };
    this.instances.value = [...this.instances.value, messageData];
  }

  readonly destroy = (id: string) => {
    const instances = this.instances.value;
    this.instances.value = instances.filter((value) => value.messageId !== id);
  }
}

