import { defineComponent, InjectionKey, provide, Ref, toRef } from 'vue';
import { CdkSelection, CdkSelectionRef } from 'vue-cdk';
import { Enum, List, Method } from 'vue-cdk/utils';
import { ElSize } from 'power-ui/types';
import { SelectionValue } from 'vue-cdk/collections/types';

export interface CheckboxGroupData {
  textColor: Ref<string | undefined>;
  fill: Ref<string | undefined>;
  disabled: Ref<boolean | undefined>;
  size: Ref<ElSize | undefined>;
}

export const groupDataKey = Symbol() as InjectionKey<CheckboxGroupData>;

export const CheckboxGroup = defineComponent({
  name: 'po-checkbox-group',
  inheritAttrs: false,
  props: {
    dataSource: {
      type: List<{ label: string, value: string | number }>(),
      default: [],
    },
    modelValue: {
      type: List<string | number>(),
      default: []
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
    onChange: {
      type: Method<(value: (string | number)[]) => void>()
    },
  },
  emits: {
    'update:modelValue': (value: (string | number)[]) => !!value,
    'change': (value: (string | number)[]) => !!value
  },
  setup(props, ctx) {
    // multiple will always return array.
    const handleSelected = (items: SelectionValue) => {
      ctx.emit('update:modelValue', items as (string | number)[]);
      ctx.emit('change', items as (string | number)[]);
    };

    provide(groupDataKey, {
      textColor: toRef(props, 'textColor'),
      fill: toRef(props, 'fill'),
      disabled: toRef(props, 'disabled'),
      size: toRef(props, 'size')
    });

    return () => (
      <div
        class="el-checkbox-group"
        role="group"
        aria-label="checkbox-group"
        {...ctx.attrs}
      >
        <CdkSelection
          ref="selection"
          multiple={true}
          modelValue={props.modelValue}
          onSelected={handleSelected}
        >
          {ctx.slots.default?.()}
        </CdkSelection>
      </div>
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

export type CheckboxGroupRef = InstanceType<typeof CheckboxGroup>;
