import { CdkSelection, ItemData, OptionItemData, CdkSelectionRef } from 'vue-cdk/selection';
import { Enum, List, Method } from 'vue-cdk/utils';
import { defineComponent, InjectionKey, provide, Ref, toRef } from 'vue';
import { ElSize } from 'power-ui/types';

export interface CheckboxGroupData {
  textColor: Ref<string | undefined>;
  fill: Ref<string | undefined>;
  disabled: Ref<boolean | undefined>;
  size: Ref<ElSize | undefined>;
}

export const groupDataKey = Symbol() as InjectionKey<CheckboxGroupData>;

export const CheckboxGroup = defineComponent({
  props: {
    dataSource: {
      type: List<{ label: string, value: string | number }>(),
      default: [],
    },
    modelValue: {
      type: List<string | number>(),
      default: []
    },
    onChange: {
      type: Method<(value: (string | number)[]) => void>(),
    },
    size: {
      type: Enum<ElSize>(),
      default: ''
    },
    fill: {
      type: String,
      default: '#409EFF'
    },
    textColor: {
      type: String,
      default: '#ffffff'
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  emits: {
    'update:modelValue': (value: (string | number)[]) => true,
    'change': (value: (string | number)[]) => true
  },
  setup(props, ctx) {
    // multiple will always return array.
    const handleSelected = (items: OptionItemData) => {
      const value = (items as ItemData[]).map(item => item.value);
      ctx.emit('update:modelValue', value);
      ctx.emit('change', value);
    };

    provide(groupDataKey, {
      textColor: toRef(props, 'textColor'),
      fill: toRef(props, 'fill'),
      disabled: toRef(props, 'disabled'),
      size: toRef(props, 'size')
    });

    return () => (
      <CdkSelection
        ref="selection"
        multiple={true}
        onSelected={handleSelected}
        initValue={props.modelValue}
      >
        {ctx.slots.default?.()}
      </CdkSelection>
    );
  },
  methods: {
    selectAll(value: boolean) {
      const selectionRef = this.$refs.selection as CdkSelectionRef;
      if (!selectionRef) {
        return;
      }
      selectionRef.selectAll(value);
    }
  }
});