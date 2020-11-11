import { ENTER, SPACE } from '../cdk/keycodes';
import { renderCondition, thenable, isXHR, Method, Model } from '../cdk/utils';
import { defineComponent, InputHTMLAttributes, reactive, ref, renderSlot } from 'vue';
import { upload as ajax } from './ajax';
import { ElUploadFile, AjaxOptions, HttpRequest, RequestMethod, } from './types';
import { UploadDragger } from './upload-dragger';
import { injectService } from './upload.service';

function noop() { }

export const UploadInput = defineComponent({
  name: 'el-upload-input',
  props: {
    type: String,
    data: Object,
    headers: Model<{ [x in string]: string }>(),
    withCredentials: Boolean,
    multiple: Boolean,
    accept: String,
    drag: Boolean,
    autoUpload: Boolean,
    listType: String,
    disabled: Boolean,
    limit: Number,
    onExceed: Method<(inputs: ElUploadFile[], currents: ElUploadFile[]) => void>(),
    action: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: 'file'
    },
    onStart: {
      type: Function,
      default: noop
    },
    onProgress: {
      type: Function,
      default: noop
    },
    onSuccess: {
      type: Function,
      default: noop
    },
    onError: {
      type: Function,
      default: noop
    },
    onPreview: {
      type: Function,
      default: noop
    },
    onRemove: {
      type: Function,
      default: noop
    },
    beforeUpload: {
      type: Function,
      default: noop
    },
    fileList: {
      type: Array as () => ElUploadFile[],
      default: []
    },
    httpRequest: {
      type: RequestMethod,
      default: ajax
    },
  },

  // data() {
  //   return {
  //     mouseover: false,
  //     reqs: {}
  //   };
  // },

  methods: {
    isImage(str: string) {
      return str.indexOf('image') !== -1;
    },
    handleChange(ev: Event) {
      const files = (ev.target! as any).files;

      if (!files) return;
      this.uploadFiles(files);
    },

    uploadFiles(files: ElUploadFile[]) {
      if (this.limit && this.fileList.length + files.length > this.limit) {
        this.onExceed && this.onExceed(files, this.fileList);
        return;
      }

      let postFiles = Array.prototype.slice.call(files);
      if (!this.multiple) { postFiles = postFiles.slice(0, 1); }

      if (postFiles.length === 0) { return; }

      postFiles.forEach(rawFile => {
        this.onStart(rawFile);
        if (this.autoUpload) this.upload(rawFile);
      });
    },

    upload(rawFile: ElUploadFile) {
      this.input!.value = '';

      if (!this.beforeUpload) {
        return this.post(rawFile);
      }

      const before = this.beforeUpload(rawFile);
      if (before && before.then) {
        before.then((processedFile: any) => {
          const fileType = Object.prototype.toString.call(processedFile);

          if (fileType === '[object File]' || fileType === '[object Blob]') {
            if (fileType === '[object Blob]') {
              processedFile = new File([processedFile], rawFile.name, {
                type: rawFile.type
              });
            }
            for (const p in rawFile) {
              if (rawFile.hasOwnProperty(p)) {
                processedFile[p] = rawFile[p];
              }
            }
            this.post(processedFile);
          } else {
            this.post(rawFile);
          }
        }, () => {
          this.onRemove(null, rawFile);
        });
      } else if (before !== false) {
        this.post(rawFile);
      } else {
        this.onRemove(null, rawFile);
      }
    },

    abort(file: ElUploadFile | string) {
      const { requests } = this;
      if (!file) {
        Object.keys(requests).forEach((innerUid) => {
          const request = requests[innerUid];
          if (isXHR(request)) {
            request.abort();
          }
          delete requests[innerUid];
        });
        return;
      }

      let uid = '';
      if (typeof file === 'string') {
        uid = file;
      } else if (typeof file === 'object') {
        uid = file.uid ?? '';
      }
      const request = requests[uid];
      if (isXHR(request)) {
        request.abort();
      }
    },

    post(rawFile: ElUploadFile) {
      const { uid } = rawFile;
      const options: AjaxOptions = {
        headers: this.headers,
        withCredentials: !!this.withCredentials,
        file: rawFile.raw!,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: e => {
          this.onProgress(e, rawFile);
        },
        onSuccess: res => {
          this.onSuccess(res, rawFile);
          delete this.requests[uid];
        },
        onError: err => {
          this.onError(err, rawFile);
          delete this.requests[uid];
        }
      };
      const request = this.httpRequest(options);
      this.requests[uid] = request;
      request
      if (thenable(request)) {
        request.then(options.onSuccess, options.onError);
      }
    },

    handleClick() {
      if (!this.disabled) {
        this.input!.value = '';
        this.input!.click();
      }
    },

    handleKeydown(e: KeyboardEvent) {
      if (e.target === e.currentTarget && (e.keyCode === ENTER || e.keyCode === SPACE)) {
        this.handleClick();
      }
    }
  },

  setup(props, ctx) {
    const input = ref<HTMLInputElement>();
    const uploadService = injectService();

    const requests = reactive<{ [x in number | string]?: HttpRequest }>({});

    return {
      input,
      requests
    }
  },

  render() {
    const {
      handleClick,
      drag,
      name,
      handleChange,
      multiple,
      accept,
      listType,
      uploadFiles,
      disabled,
      handleKeydown
    } = this;

    const divAttrs = {
      class: {
        'el-upload': true,
        [`el-upload--${listType}`]: true
      },
      onClick: handleClick,
      onKeydown: handleKeydown,
      tabindex: 0,
    };
    const draggerProps = {
      onFile: uploadFiles,
      disabled,
      'v-slots': { ...this.$slots }
    }

    const inputAttrs: InputHTMLAttributes & { ref: string } = {
      class: 'el-upload__input',
      type: "file",
      ref: 'input',
      name,
      onChange: handleChange,
      multiple,
      accept
    }
    return (
      <div {...divAttrs}>
        {renderCondition(
          !!drag,
          <UploadDragger {...draggerProps} />,
          renderSlot(this.$slots, 'default')
        )}
        <input {...inputAttrs}></input>
      </div>
    );
  }
});

export type UploadInputComponent = InstanceType<typeof UploadInput>;