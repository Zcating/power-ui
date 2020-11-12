import { watchRef } from '../../cdk/hook';
import { defineComponent, inject, Ref, ref, renderSlot, toRef } from "vue";
import { SelectSerivce } from '../select.service';
import { OptionService } from './option.service';

export const Option = defineComponent({
  name: 'el-option',
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    label: {
      type: [String, Number],
      default: '',
    },
    created: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const elDisabled = watchRef(toRef(props, 'disabled'));
    const hover = ref(false);
    const limitReached = ref(false);

    const service = inject(OptionService.key);
    if (service) {
      service.watchDisabled((value) => elDisabled.value = value);
    }

    let selected: Ref<boolean>;
    
    const selectSerivce = inject(SelectSerivce.key);
    if (selectSerivce) {
      selected = selectSerivce.watchOptions(toRef(props, 'label'), toRef(props, 'value'), Symbol());
    } else {
      selected = ref(false);
    }

    const hoverItem = () => {}

    const optionClick = () => {
      selected.value = true;
    }
  

    return {
      elDisabled,
      hover,
      limitReached,
      hoverItem,
      optionClick,
      selected,
    };
  },

  render() {
    const {
      $slots,
      hoverItem,
      optionClick,
      selected,
      elDisabled,
      limitReached,
      hover
    } = this;
    return (
      <li
        onMouseenter={hoverItem}
        onClick={optionClick}
        class={["el-select-dropdown__item", {
          'selected': selected,
          'is-disabled': elDisabled || limitReached,
          'hover': hover
        }]}
      >
        {renderSlot($slots, 'default')}
      </li>
    );
  }
});