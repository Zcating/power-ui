export type MessageType = 'success' | 'info' | 'warning' | 'error' | 'loading';

export interface MessageData {
  type?: MessageType;
  content?: string;
  iconClass?: string;
  messageId?: string;
  createdAt?: Date;
  options?: MessageDataOptions;
}

export interface MessageDataOptions {
  data?: string;
}