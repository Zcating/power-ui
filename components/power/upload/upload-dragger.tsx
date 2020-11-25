import { defineComponent, ref, renderSlot } from 'vue';
import { injectService } from './upload.service';

export const UploadDragger = defineComponent({
  name: 'el-upload-dragger',
  props: {
    disabled: Boolean,
    onFile: Function,
  },

  setup(props, ctx) {
    const uploadService = injectService();
    const dragover = ref(false);

    function onDragover(e: DragEvent) {
      e.preventDefault();
      if (!props.disabled) {
        dragover.value = true;
      }
    }

    function onDragleave(e: DragEvent) {
      e.preventDefault();
      dragover.value = false;
    }

    function onDrop(e: DragEvent) {
      e.preventDefault();
      if (props.disabled || !uploadService) return;
      const accept = uploadService.accept;
      const files = (e.dataTransfer?.files ?? []) as File[];
      dragover.value = false;
      if (!accept) {
        props.onFile?.(files);
        // ctx.emit('file', files);
        return;
      }
      const validatedFiles = Array.prototype.slice.call(files).filter((file: File) => {
        const { type, name } = file;
        const extension = name.indexOf('.') > -1
          ? `.${name.split('.').pop()}`
          : '';
        const baseType = type.replace(/\/.*$/, '');
        return accept.split(',')
          .map(type => type.trim())
          .filter(type => type)
          .some(acceptedType => {
            if (/\..+$/.test(acceptedType)) {
              return extension === acceptedType;
            }
            if (/\/\*$/.test(acceptedType)) {
              return baseType === acceptedType.replace(/\/\*$/, '');
            }
            if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
              return type === acceptedType;
            }
            return false;
          });
      });
      props.onFile?.(validatedFiles);
    }
    return () => (
      <div
        class="el-upload-dragger is-dragover"
        onDrop={onDrop}
        onDragover={onDragover}
        onDragleave={onDragleave}
      >
        {renderSlot(ctx.slots, 'default')}
      </div>
    );

  }
});
