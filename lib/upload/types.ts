import { Method } from '../cdk/utils';

export type EleUploadType = 'picture-card' | 'picture' | 'text';


export type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';


export interface ElUploadFile {
  uid: string;
  size?: number;
  name: string;
  filename?: string;
  lastModified?: string;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  raw?: File;
  percent?: number;
  thumbUrl?: string;
  response?: any;
  error?: any;
  linkProps?: { download: string };
  type?: string;

  [x: string]: any;
}

export class HttpError extends Error {
  constructor(
    msg: string,
    public readonly status: number,
    public readonly method: string,
    public readonly url: string
  ) {
    super(msg);
  }
}

type AjaxBody = {[x: string]: any} | string | null;

export type AjaxEvent = ProgressEvent | (ProgressEvent & {percent: number});

export type AjaxError = HttpError | AjaxEvent;

export interface AjaxOptions {
  action: string;
  headers?: {[x: string]: string},
  data: any;
  filename: string;
  file: File;
  withCredentials: boolean;
  onProgress: (e: ProgressEvent & {percent: number}) => void;
  onSuccess: (body: AjaxBody) => void;
  onError: (error: AjaxError) => void;
}

export type HttpRequest = XMLHttpRequest | PromiseLike<any> | undefined;

export const RequestMethod = Method<(options: AjaxOptions) => HttpRequest>();

export const BeforeMethod = Method<(file: ElUploadFile) => boolean | Promise<boolean>>();

export const OnChangeMethod = Method<((file: ElUploadFile, files: ElUploadFile[], type: string) => void)>();
