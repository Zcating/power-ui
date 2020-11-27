import { defineComponent, inject, InjectionKey, provide, Ref, ref, toRef, watch } from 'vue';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW } from 'vue-cdk/keycodes';
import { Enum } from 'vue-cdk/utils';
import { CdkSelection } from 'vue-cdk/selection';
import { ElSize } from '../types';

export interface RadioGroupData {
  textColor: Ref<string | undefined>;
  fill: Ref<string | undefined>;
  disabled: Ref<boolean | undefined>;
  size: Ref<ElSize | undefined>;
}

const groupDataKey = Symbol('po-radio-group-data') as InjectionKey<RadioGroupData>;

export const useRadioGroupData = () => {
  return inject(groupDataKey, undefined) as RadioGroupData | undefined;
};

export const RadioGroup = defineComponent({
  name: 'po-radio',

  props: {
    modelValue: {
      type: [String, Number],
      default: ''
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
    dataSource: [],
  },

  setup(props, ctx) {
    const groupRef = ref<HTMLDivElement>();
    watch(groupRef, (el) => {
      if (!el) {
        return;
      }
      // 当radioGroup没有默认选项时，第一个可以选中Tab导航
      const radios = el.querySelectorAll<HTMLLabelElement>('[type=radio]');
      const firstLabel = el.querySelectorAll<HTMLLabelElement>('[role=radio]')[0];
      if (!Array.prototype.some.call(radios, radio => radio.checked) && firstLabel) {
        firstLabel.tabIndex = 0;
      }
    });

    provide(groupDataKey, {
      textColor: toRef(props, 'textColor'),
      fill: toRef(props, 'fill'),
      disabled: toRef(props, 'disabled'),
      size: toRef(props, 'size')
    });

    const handleKeydown = (e: KeyboardEvent) => {
      const el = groupRef.value;
      if (!el) {
        return;
      }
      const target = e.target! as HTMLElement;
      const className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]';
      const radios = el.querySelectorAll<HTMLLabelElement>(className);
      const length = radios.length;
      const index = Array.prototype.indexOf.call(radios, target);
      const roleRadios = el.querySelectorAll<HTMLLabelElement>('[role=radio]');
      switch (e.keyCode) {
        case LEFT_ARROW:
        case UP_ARROW:
          e.stopPropagation();
          e.preventDefault();
          if (index === 0) {
            roleRadios[length - 1].click();
            roleRadios[length - 1].focus();
          } else {
            roleRadios[index - 1].click();
            roleRadios[index - 1].focus();
          }
          break;
        case RIGHT_ARROW:
        case DOWN_ARROW:
          if (index === (length - 1)) {
            e.stopPropagation();
            e.preventDefault();
            roleRadios[0].click();
            roleRadios[0].focus();
          } else {
            roleRadios[index + 1].click();
            roleRadios[index + 1].focus();
          }
          break;
        default:
          break;
      }
    };

    return () => (
      <div
        ref={groupRef}
        class="el-radio-group"
        role="radiogroup"
        onKeydown={handleKeydown}
      >
        <CdkSelection
          modelValue={props.modelValue}
          onSelected={(value) => ctx.emit('update:modelValue', value)}
        >
          {ctx.slots.default?.()}
        </CdkSelection>
      </div>
    );
  }
});