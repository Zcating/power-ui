import { Directive, ref } from 'vue';
import { getElement } from 'vue-cdk/utils';
import { CdkClipboard } from './clipboard';


/**
 * @class ClipboardDirective
 * allow user custom there v-clip.
 * @param board Custom clipboard
 */
export const ClipboardDirective = (board: CdkClipboard): Directive => {
  const text = ref('');
  const handleClick = () => {
    board.copy(text.value);
  };
  return {
    mounted(el, binding) {
      const ele = getElement(el);
      ele?.addEventListener('click', handleClick);
      text.value = binding.value;
    },

    updated(el, binding) {
      text.value = binding.value;
    },
    unmounted(el) {
      const ele = getElement(el);
      ele?.removeEventListener('click', handleClick);
    }
  };
};
