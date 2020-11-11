import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW } from '../cdk/keycodes';
import { defineComponent, ref, renderSlot, watch } from 'vue';
import { RadioService } from './radio.service';
import { Enum } from '../cdk/utils';
import { fastWatch } from '../cdk/hook';
import { ElSize } from '../types';

export const RadioGroup = defineComponent({
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: ''
    },
    size: Enum<ElSize>(),
    fill: String,
    textColor: String,
    disabled: Boolean
  },

  setup(props, ctx) {

    const service = new RadioService();
    service.watchEventChange((value) => {
      ctx.emit('change', value);
    });
    fastWatch(() => props.disabled, value => service.setDisabled(!!value));
    fastWatch(() => props.size, value => service.setSize(value ?? ''));
    fastWatch(() => props.modelValue, value => service.select(value));

    service.watchSelect((value) => {
      if (value === props.modelValue) {
        return;
      }
      ctx.emit('update:modelValue', value);
    });


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

    return {
      group: groupRef,
    }
  },

  methods: {
    // 左右上下按键 可以在radio组内切换不同选项
    handleKeydown(e: KeyboardEvent) {
      const el = this.group!;
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
    }
  },

  render() {
    const {
      $slots,
      handleKeydown
    } = this;
    return <div
      ref="group"
      class="el-radio-group"
      role="radiogroup"
      onKeydown={handleKeydown}
    >
      {renderSlot($slots, 'default')}
    </div>
  }
});