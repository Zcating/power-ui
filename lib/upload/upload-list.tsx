import { DELETE } from '../cdk/keycodes';
import { renderCondition } from '../cdk/utils';
import { computed, defineComponent, renderSlot, TransitionGroup } from 'vue';
import { EleUploadType, ElUploadFile } from './types';
import { Progress } from '../progress';


export const UploadList = defineComponent({
  name: 'el-upload-list',
  props: {
    files: {
      type: Array as () => ElUploadFile[],
      default: [],
    },
    disabled: {
      type: Boolean,
      default: false
    },
    listType: {
      type: String as () => EleUploadType,
      default: 'picture'
    },
    handlePreview: Function,
    onRemove: Function,
  },

  setup(props) {
    const files: File[] = [];
    const focusing = false;

    const isPicture = computed(() => ['picture-card', 'picture'].indexOf(props.listType) > -1);
    const isCard = computed(() => props.listType === 'picture-card');

    const uploadListClass = computed(() => `el-upload-list el-upload-list--${props.listType} ${props.disabled ? 'is-disabled' : ''}`)

    const uploadIconClass = computed(() => {
      const clazz = ['el-icon-upload-success'];
      if (props.listType === 'text') {
        clazz.push('el-icon-circle-check');
      }

      if (isPicture.value) {
        clazz.push('el-icon-check');
      }
      return clazz;
    });

    return {
      files,
      focusing,
      isPicture,
      isCard,
      uploadListClass,
      uploadIconClass
    }
  },

  render() {
    const {
      $slots: slots,
      files,
      focusing,
      disabled,
      isPicture: validateType,
      isCard,
      handlePreview,
      uploadListClass,
      uploadIconClass
    } = this;

    const onRemoveCreator = (file: ElUploadFile) => () => this.$emit('remove', file);

    const previewIcon = (file: ElUploadFile) => {
      if (!handlePreview) {
        return;
      }
      return <span
        class="el-upload-list__item-preview"
        onClick={() => handlePreview(file)}
      >
        <i class="el-icon-zoom-in"></i>
      </span>;
    }

    const fileNodes = files.map((file) => {
      const onRemove = onRemoveCreator(file);
      return (
        <li
          class={['el-upload-list__item', `is-${file.status}`, focusing ? 'focusing' : '']}
          key={file.uid}
          tabindex={0}
          onFocus={() => this.focusing = true}
          onClick={() => this.focusing = false}
          onBlur={() => this.focusing = false}
          onKeydown={(e: KeyboardEvent) => e.keyCode === DELETE && !disabled && onRemove()}
        >
          {renderSlot(slots, 'file', { file })}
          {renderCondition(
            file.status !== 'uploading' && validateType,
            <img src={file.url} alt="" />
          )}
          <a class="el-upload-list__item-name" onClick={() => handlePreview?.(file)}>
            <i class="el-icon-document"></i>
            {file.name}
          </a>
          <label class="el-upload-list__item-status-label">
            <i class={uploadIconClass}></i>
          </label>
          {renderCondition(!disabled, <i class="el-icon-close" onClick={onRemove} />)}
          {/* <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上--> */}
          {renderCondition(!disabled, <i class="el-icon-close-tip">delete</i>)}
          {renderCondition(
            file.status === 'uploading',
            <Progress
              type={isCard ? 'circle' : 'line'}
              stroke-width={isCard ? 6 : 2}
              percentage={parseInt(file.percentage)}
            />
          )}
          {renderCondition(
            isCard,
            <span class="el-upload-list__item-actions">
              {previewIcon(file)}
              {renderCondition(
                !disabled,
                <span class="el-upload-list__item-delete" onClick={onRemove}>
                  <i class="el-icon-delete"></i>
                </span>
              )}
            </span>
          )}
        </li>
      )
    });
    return (
      <TransitionGroup
        tag="ul"
        name="el-list"
        moveClass={uploadListClass}
      >
        {...fileNodes}
      </TransitionGroup >
    );
  }
});