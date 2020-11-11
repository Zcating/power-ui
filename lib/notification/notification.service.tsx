import { DefineComponent, InjectionKey, provide, Ref, ref } from "vue";
import createContainter from './notification-container';
import { NotificationConfig, NotificationConfigOptions, NotificationData } from './types';

let _notiCounter = 0;

export abstract class NotificationService {

  abstract notify(data: NotificationData): void;

  abstract success(title:string, message: string): void;

  abstract info(title:string, message: string): void;

  abstract warning(title:string, message: string): void;

  abstract error(title:string, message: string): void;

  abstract closeAll(): void;

  abstract config(options: NotificationConfigOptions): void;

  protected abstract create(data: NotificationData): void;
}

export class NotificationServiceImpl extends NotificationService {
  readonly container: DefineComponent;

  private readonly instances: Ref<Required<NotificationData>[]> = ref([]);

  private readonly _config: Ref<NotificationConfig> = ref({
    offset: 16,
    duration: 4500,
  });

  constructor(key: InjectionKey<NotificationService>) {
    super();
    this.container = this.render();
    provide(key, this);
  }

  notify(data: NotificationData): void {
    this.create(data);
  }

  success(title: string, message: string): void {
    this.create({type: 'success', title, message});
  }

  info(title: string, message: string): void {
    this.create({type: 'info', title, message});
  }

  warning(title: string, message: string): void {
    this.create({type: 'warning', title, message});
  }
  
  error(title: string, message: string): void {
    this.create({type: 'error', title, message});
  }

  closeAll(): void {
    this.instances.value = [];
  }

  protected create(data: NotificationData): void {
    this.instances.value.push({
      notificationId: `el-noti-${_notiCounter++}`,
      title: data.title || '',
      message: data.message || '',
      type: data.type || 'info',
      customClass: data.customClass || '',
      position: data.position || 'top-right',
      showClose: data.showClose || false,
      duration: data.duration ?? this._config.value.duration,
      onClick: data.onClick || null,
      onClose: data.onClose || null,
    });
  }

  close(id: string) {
    const instances = this.instances.value;
    this.instances.value = instances.filter((value) => value.notificationId !== id);
  }

  config(options: NotificationConfigOptions) {
    const current = this._config.value;
    this._config.value = {
      offset: options.offset || current.offset,
      duration: options.duration || current.duration
    }
  }

  render(): DefineComponent {
    return createContainter(this._config, this.instances, this.close.bind(this)) as any;
  }
}
