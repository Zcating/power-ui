import { AjaxOptions, HttpError } from './types';

export function upload(options: AjaxOptions) {
  if (typeof XMLHttpRequest === 'undefined') {
    return;
  }

  const xhr = new XMLHttpRequest();
  const action = options.action;

  if (xhr.upload) {
    xhr.upload.onprogress = function progress(e: ProgressEvent) {
      if (e.total > 0) {
        (e as any).percent = e.loaded / e.total * 100;
      }
      options.onProgress(e as any);
    };
  }

  const formData = new FormData();

  if (options.data) {
    Object.keys(options.data).forEach(key => {
      formData.append(key, options.data[key]);
    });
  }

  formData.append(options.filename, options.file, options.file.name);

  xhr.onerror = function error(e) {
    options.onError(e);
  };

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      return options.onError(getError(action, options, xhr));
    }

    options.onSuccess(getBody(xhr));
  };

  xhr.open('post', action, true);

  if (options.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true;
  }

  const headers = options.headers || {};

  for (const item in headers) {
    if (headers.hasOwnProperty(item) && headers[item] !== null) {
      xhr.setRequestHeader(item, headers[item]);
    }
  }
  xhr.send(formData);
  return xhr;
}


function getError(action: string, option: AjaxOptions, xhr: XMLHttpRequest): HttpError {
  let msg;
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`;
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`;
  } else {
    msg = `fail to post ${action} ${xhr.status}`;
  }

  return new HttpError(msg, xhr.status, 'post', action);
}

function getBody(xhr: XMLHttpRequest): {[x: string]: any} | string | null {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}