import { computed, defineComponent, getCurrentInstance, nextTick, onMounted, Ref, ref, SetupContext, toRef } from 'vue';
import { List, renderCondition, isEqual } from '../cdk/utils';
import { CdkSelection } from '../cdk/selection';
import { Tooltip, vTooltip } from '../tooltip';
import { Input } from '../input';
import { SelectSerivce } from './select.service';

function useClear(
  ctx: SetupContext,
  inputValue: Ref<any>,
  visible: Ref<boolean>,
  remote: Ref<boolean>,
  filterable: Ref<boolean>,
  multiple: Ref<boolean>
) {
  const iconClass = computed(() => {
    return remote.value && filterable.value ? '' : (visible.value ? 'arrow-up is-reverse' : 'arrow-up');
  });

  const onClear = (event: Event) => {
    event.stopPropagation();
    const value = multiple.value ? [] : '';
    if (!isEqual(inputValue.value, value)) {
      ctx.emit('change', value);
    }
    ctx.emit('input', value);
    ctx.emit('clear');
    visible.value = false;
  };

  return {
    iconClass,
    onClear
  };
}


export const Select = defineComponent({
  directives: {
    tooltip: vTooltip,
  },
  props: {
    id: String,
    name: String,
    modelValue: {
      type: [String, Number, List<string | number>()],
      default: ''
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    automaticDropdown: Boolean,
    size: String,
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    allowCreate: Boolean,
    loading: Boolean,
    popperClass: String,
    remote: Boolean,
    loadingText: String,
    noMatchText: String,
    noDataText: String,
    remoteMethod: Function,
    filterMethod: Function,
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default: 'el.select.placeholder',
    },
    readonly: {
      type: Boolean,
      default: false
    },
    defaultFirstOption: Boolean,
    reserveKeyword: Boolean,
    collapseTags: Boolean,
    valueKey: {
      type: String,
      default: 'value'
    },
  },

  setup(props, ctx) {
    const emptyText = computed(() => '');
    const selectedLabel = ref('');
    const tooltipVisible = ref(false);

    const service = new SelectSerivce(toRef(props, 'multiple'));
    service.watchValue((data, multiple) => {
      if (!data) {
        return;
      }

      if (multiple) {
        const array = Array.isArray(data) ? data.map(value => value.value) : [data.value];
        ctx.emit('update:modelValue', array);
      } else {
        if (!Array.isArray(data)) {
          ctx.emit('update:modelValue', data.value);
          selectedLabel.value = data.label;
        }
        tooltipVisible.value = false;
      }
    });

    const handleClearClick = () => {
      selectedLabel.value = '';
      ctx.emit('update:modelValue', undefined);
    };

    const iconClass = computed(() => {
      return tooltipVisible.value ? 'arrow-up is-reverse' : 'arrow-up';
    });

    const showClose = computed(() => {
      return props.clearable;
    });

    const inputWidth = ref(0);
    onMounted(() => {
      const instance = getCurrentInstance();
      if (!(instance && instance.refs.reference)) {
        return;
      }
      nextTick(() => {
        inputWidth.value = (instance.refs.reference as any).$el.getBoundingClientRect().width;
      });
    });

    return () => {
      const {
        id,
        multiple,
        filterable,
        placeholder,
        readonly,
        loading,
        allowCreate,
        autocomplete,
        disabled,
        size
      } = props;

      return [
        <div
          class={['el-select', size ? 'el-select--' + size : '']}
          v-tooltip="tooltip"
        >
          <Input
            ref="reference"
            v-model={selectedLabel.value}
            type="text"
            placeholder={placeholder}
            id={id}
            name={name}
            autocomplete={autocomplete}
            size={size}
            disabled={disabled}
            readonly={readonly}
            validate-event="false"
            class={{ 'is-focus': tooltipVisible.value }}
            tabindex={(multiple && filterable) ? -1 : undefined}
            // onFocus={handleFocus}
            // onBlur={handleBlur}
            v-slots={{
              prefix: renderCondition(ctx.slots.prefix, ctx.slots.prefix),
              suffix: () => [
                <i v-show={!showClose.value} class={['el-select__caret', 'el-input__icon', 'el-icon-' + iconClass.value]} />,
                renderCondition(showClose.value, <i class="el-select__caret el-input__icon el-icon-circle-close" onClick={handleClearClick} />)
              ],
            }}
          />
        </div>,
        <Tooltip
          v-model={tooltipVisible.value}
          ref="tooltip"
          trigger="click-close"
          placement="bottom"
          effect="light"
          transition="el-zoom-in-top"
          visibleArrow={false}
          popperClass={'el-select-dropdown'}
          popperStyle={{ minWidth: `${inputWidth.value}px` }}
        >
          <CdkSelection
            multiple={multiple}
            v-slots={{
              default: () => (
                <div class={['el-select-dropdown__wrap',]}>
                  <ul
                    v-show={!loading}
                    class={['el-select-dropdown__list', { 'is-empty': !allowCreate }]}
                  >
                    {ctx.slots.default?.()}
                  </ul>
                </div>
              ),
              placeholder: () => renderCondition(
                emptyText && (!allowCreate || loading),
                renderCondition(
                  ctx.slots.empty,
                  ctx.slots.empty?.(),
                  <p class="el-select-dropdown__empty">
                    {emptyText}
                  </p>
                )
              )
            }}
          />
        </Tooltip>,
      ];
    };
  }
});
