import { InjectionKey, Ref, ref, shallowRef } from 'vue';
import { NotificationConfig, NotificationConfigOptions, NotificationData } from './types';

let _notiCounter = 0;

export const $notification = Symbol() as InjectionKey<NotificationService>;
export const $notificationImpl = Symbol() as InjectionKey<NotificationServiceImpl>;

export abstract class NotificationService {

  abstract notify(data: NotificationData): void;

  abstract success(title: string, message: string): void;

  abstract info(title: string, message: string): void;

  abstract warning(title: string, message: string): void;

  abstract error(title: string, message: string): void;

  abstract closeAll(): void;

  abstract config(options: NotificationConfigOptions): void;

  protected abstract create(data: NotificationData): void;
}

export class NotificationServiceImpl extends NotificationService {

  private readonly instances: Ref<Required<NotificationData>[]> = shallowRef([]);

  private readonly _configRef: Ref<NotificationConfig> = ref({
    offset: 16,
    duration: 4500,
  });

  get datas() {
    return this.instances.value;
  }

  get _config() {
    return this._configRef.value;
  }

  notify(data: NotificationData): void {
    this.create(data);
  }

  success(title: string, message: string): void {
    this.create({ type: 'success', title, message });
  }

  info(title: string, message: string): void {
    this.create({ type: 'info', title, message });
  }

  warning(title: string, message: string): void {
    this.create({ type: 'warning', title, message });
  }

  error(title: string, message: string): void {
    this.create({ type: 'error', title, message });
  }

  closeAll(): void {
    this.instances.value = [];
  }

  config(options: NotificationConfigOptions) {
    const current = this._configRef.value;
    this._configRef.value = {
      offset: options.offset || current.offset,
      duration: options.duration || current.duration
    };
  }

  protected create(data: NotificationData): void {
    this.instances.value = [...this.instances.value, {
      notificationId: `el-noti-${_notiCounter++}`,
      title: data.title || '',
      message: data.message || '',
      type: data.type || 'info',
      customClass: data.customClass || '',
      position: data.position || 'top-right',
      showClose: data.showClose || false,
      duration: data.duration ?? this._configRef.value.duration,
      onClick: data.onClick || null,
      onClose: data.onClose || null,
    }];
  }

  close = (id: string) => {
    const instances = this.instances.value;
    this.instances.value = instances.filter((value) => value.notificationId !== id);
  }
}
