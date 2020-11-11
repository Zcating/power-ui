import { provide, InjectionKey, inject } from 'vue';

export const uploadKey = Symbol('el-uploader') as InjectionKey<UploadService>;

export function injectService() {
  return inject(uploadKey, new UploadService);
}

export class UploadService {
  public accept?: string;
  constructor() {
    provide(uploadKey, this);
  }
}