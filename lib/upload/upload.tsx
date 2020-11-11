import { computed, defineComponent, inject, onBeforeUnmount, Prop, ref, renderSlot, watch } from "vue";
import { BeforeMethod, EleUploadType, ElUploadFile, OnChangeMethod, RequestMethod } from './types';
import { UploadService } from './upload.service';
import { UploadList } from './upload-list';
import { UploadInput, UploadInputComponent } from './upload-input';
import { thenable, renderCondition, isObject, Model, List, Enum } from '../cdk/utils';

function noop() { }

const isPicture = (listType: EleUploadType) => listType === 'picture-card' || listType === 'picture';


export const Upload = defineComponent({
  name: 'el-upload',
  props: {
    data: Object,
    multiple: Boolean,
    drag: Boolean,
    dragger: Boolean,
    withCredentials: Boolean,
    accept: String,
    httpRequest: RequestMethod,
    disabled: Boolean,
    limit: Number,
    beforeUpload: BeforeMethod,
    beforeRemove: BeforeMethod,
    action: {
      type: String,
      required: true
    },
    headers: {
      type: Model<{[x in string] : any}>(),
      default: {}
    },
    name: {
      type: String,
      default: 'file'
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    type: {
      type: Enum<'select'>(),
      default: 'select'
    },
    onChange: {
      type: OnChangeMethod,
      default: noop
    },
    onPreview: {
      type: Function
    },
    onExceed: {
      type: Function,
      default: noop
    },
    fileList: {
      type: List<ElUploadFile>(),
      default: [] as ElUploadFile[],
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: Enum<EleUploadType>(),
      default: 'text'
    },
  },
  
  setup(props, ctx) {
    const uploadService = new UploadService();

    // TODO: add form object & its type
    const elForm = inject('el-form')! as any;

    const uploadInput = ref<UploadInputComponent>();

    const uploadDisabled = computed(() => props.disabled || !!(isObject(elForm) && (elForm as any).disabled));

    const uploadFiles = ref<ElUploadFile[]>([]);

    watch(() => props.listType, (type) => {
      if (isPicture(type)) {
        const files = uploadFiles.value;
        uploadFiles.value = files.map((file: any) => {
          if (!file.url && file.raw) {
            try {
              file.url = URL.createObjectURL(file.raw);
            } catch (err) {
              console.error('[Element Error][Upload]', err);
            }
          }
          return file;
        });
      }
    });

    const tempIndex = ref(0);
    watch(() => props.fileList, (files) => {
      if (!files) {
        return;
      }
      uploadFiles.value = files.map((file) => {
        file.uid = file.uid || `${(Date.now() + tempIndex.value++)}`;
        file.status = file.status || 'success';
        return file;
      });
    }, { immediate: true });

    onBeforeUnmount(() => {
      uploadFiles.value.forEach((file: any) => {
        if (file.url && file.url.indexOf('blob:') === 0) {
          URL.revokeObjectURL(file.url);
        }
      });
    });

    return {
      tempIndex,
      uploadFiles,
      uploadInput,
      uploadDisabled,
    }
  },

  methods: {
    fileToObject(file: ElUploadFile): ElUploadFile {
      return {
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.filename || file.name,
        size: file.size,
        type: file.type,
        uid: file.uid || `${Date.now() + this.tempIndex++}`,
        response: file.response,
        error: file.error,
        percent: 0,
        raw: file as any
      };
    },

    handleStart(file: ElUploadFile) {
      let targetItem = this.fileToObject(file);
      targetItem.status = 'uploading';

      if (isPicture(this.listType)) {
        try {
          targetItem.url = URL.createObjectURL(file);
        } catch (err) {
          console.error('[Element Error][Upload]', err);
          return;
        }
      }
      this.uploadFiles.push(targetItem);
      this.onChange?.(targetItem, this.uploadFiles, 'start');
    },

    handleProgress(e: { percent: number }, file: ElUploadFile) {
      const targetItem = this.getFile(file, this.uploadFiles)!;
      targetItem.status = 'uploading';
      targetItem.percentage = e.percent || 0;

      this.onChange(file, this.uploadFiles, 'progress');
    },

    handleSuccess(res: {}, file: ElUploadFile) {
      const targetItem = this.getFile(file, this.uploadFiles);
      targetItem.status = 'done';
      targetItem.response = res;
      if (file) {
        file.status = 'success';
        file.response = res;

        this.onChange({ ...targetItem }, this.uploadFiles, 'success');
      }
    },

    handleError(err: any, file: ElUploadFile) {
      const targetItem = this.getFile(file, this.uploadFiles);
      targetItem.error = err;
      targetItem.status = 'error';
      this.onChange(file, this.uploadFiles, 'error');
    },

    handleRemove(file: ElUploadFile) {
      file.status = 'removed';

      const doRemove = () => {
        this.abort(file);
        this.uploadFiles = this.removeFile(file, this.uploadFiles);
        this.onChange(file, this.uploadFiles, 'removed');
      };

      const beforeRemove = this.beforeRemove;
      if (beforeRemove && typeof beforeRemove === 'function') {
        const before = beforeRemove(file);
        if (thenable(before)) {
          before.then(() => doRemove(), noop);
        } else if (before === true) {
          doRemove();
        }
      } else {
        doRemove();
      }
    },

    getFile: (file: ElUploadFile, files: ElUploadFile[]) => files.find(item => file.uid === item.uid)!,

    removeFile:(file: ElUploadFile, files: ElUploadFile[]) => files.filter(item => file.uid !== file.uid),

    abort(file: ElUploadFile) {
      this.uploadInput!.abort(file);
    },

    clearFiles() {
      this.uploadFiles = [];
    },

    submit() {
      this.uploadFiles
        .filter(file => file.status === 'uploading')
        .forEach(file => this.uploadInput!.upload(file));
    },
  },

  
  render() {
    const {
      $slots: slots,
      uploadDisabled,
      uploadFiles,
      handleStart,
      handleSuccess,
      handleError,
      handleProgress,
      handleRemove,
    } = this;

    const {
      showFileList,
      type,
      drag,
      action,
      multiple,
      listType,
      onPreview,
      onExceed,
      withCredentials,
      headers,
      name,
      data,
      accept,
      autoUpload,
      limit,
      httpRequest,
      beforeUpload,
    } = this.$props;

    const uploadList = renderCondition(
      showFileList,
      <UploadList
        disabled={uploadDisabled}
        listType={listType}
        files={uploadFiles}
        onRemove={handleRemove}
        handlePreview={onPreview}
        v-slots={{
          file: slots.file,
        }}
      />
    );

    const uploadData = {
      ref: 'uploadInput',
      type,
      drag,
      action,
      multiple,
      beforeUpload,
      withCredentials,
      headers,
      name,
      data,
      accept,
      autoUpload,
      listType,
      limit,
      onExceed,
      onPreview,
      httpRequest,
      fileList: uploadFiles,
      disabled: uploadDisabled,
      onStart: handleStart,
      onProgress: handleProgress,
      onSuccess: handleSuccess,
      onError: handleError,
      onRemove: handleRemove,
      'v-slots': {
        default: slots.trigger || slots.default
      },
    } as any;

    const uploadComponent = [
      <UploadInput {...uploadData} />,
      renderCondition(!!slots.trigger, renderSlot(slots, 'default'))
    ];

    return (
      <div>
        {renderCondition(listType === 'picture-card', uploadList)}
        {...uploadComponent}
        {renderSlot(slots, 'tip')}
        {renderCondition(listType !== 'picture-card', uploadList)}
      </div>
    );
  },
});
