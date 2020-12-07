import { computed, defineComponent, getCurrentInstance, nextTick, onMounted, Ref, ref, toRef, UnwrapRef } from 'vue';
import { List, isEqual, renderCondition, Method } from 'vue-cdk/utils';
import { CdkSelection } from 'vue-cdk/selection';
import { Tooltip } from '../tooltip';
import { Input } from '../input';
import { provideDescMap } from './utils';
import { SelectionValue } from 'vue-cdk/selection/types';
import { watchRef } from 'vue-cdk/hook';


export const Select = defineComponent({
  name: 'po-select',
  inheritAttrs: false,
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
    onBlur: Method<(event: FocusEvent) => void>(),
    onFocus: Method<(event: FocusEvent) => void>(),
    onChange: Method<(event: Event) => void>(),
    onInput: Method<(event: SelectionValue) => void>()
  },

  setup(props, ctx) {
    const selectedLabel = ref('');
    const tooltipVisible = ref(false);
    const modelRef = watchRef(toRef(props, 'modelValue') as Ref<SelectionValue>, (value) => {
      ctx.emit('update:modelValue', value);
    });

    // provide a map to get description from selection.
    const map = provideDescMap();
    const handleSelected = (value: SelectionValue) => {
      if (!value) {
        return;
      }
      if (Array.isArray(value)) {
        // TODO: Provide mutitple selection
      } else {
        selectedLabel.value = map.get(value);
        tooltipVisible.value = false;

        ctx.emit('change', selectedLabel.value);
      }
    };

    const handleClearClick = (event: Event) => {
      event.stopPropagation();

      selectedLabel.value = '';
      modelRef.value = '';
      tooltipVisible.value = false;

      const value = props.multiple ? [] : '';
      if (!isEqual(modelRef.value, value)) {
        ctx.emit('change', value);
      }
      ctx.emit('input', value);
      ctx.emit('clear');
    };

    const iconClass = computed(() => {
      return tooltipVisible.value ? 'arrow-up is-reverse' : 'arrow-up';
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

    const handleBlur = (event: FocusEvent) => {
      ctx.emit('blur', event);
      console.log('select-blur');
    };

    const handleFocus = (event: FocusEvent) => {
      ctx.emit('focus', event);
    };

    const emptyText = computed(() => '');

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
        size,
        clearable
      } = props;
      const content = () => (
        <CdkSelection
          v-model={modelRef.value}
          onSelected={handleSelected}
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
            empty: () => renderCondition(
              emptyText && (!allowCreate || loading),
              ctx.slots.empty ? ctx.slots.empty() : <p class="el-select-dropdown__empty">{emptyText.value}</p>,
            )
          }}
        />
      );
      return (
        <Tooltip
          v-model={tooltipVisible.value}
          trigger="click-close"
          placement="bottom"
          effect="light"
          transition="el-zoom-in-top"
          visibleArrow={false}
          popperClass={'el-select-dropdown'}
          popperStyle={{ minWidth: `${inputWidth.value}px` }}
          v-slots={{ content }}
        >
          <div class={['el-select', size ? 'el-select--' + size : '']}>
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
              v-slots={{
                prefix: renderCondition(ctx.slots.prefix, ctx.slots.prefix),
                suffix: () => [
                  <i
                    v-show={!clearable}
                    class={['el-select__caret', 'el-input__icon', 'el-icon-' + iconClass.value]}
                  />,
                  renderCondition(
                    clearable,
                    <i
                      class="el-select__caret el-input__icon el-icon-circle-close"
                      onClick={handleClearClick}
                    />
                  )
                ],
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
        </Tooltip>
      );
    };
  }
});
