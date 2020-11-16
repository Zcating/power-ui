import { Directive } from 'vue';

export const vPopover: Directive = {
  mounted(el, binding) {
    const instance = binding.instance;
    if (!instance || !instance.$refs) {
      return;
    }

    const popover = instance.$refs[binding.value] as any;
    if (popover && typeof popover === 'object' && popover.eltype === 'popover') {
      const tooltip = popover.$refs.tooltip;
      if (!tooltip) {
        throw Error('popover\'s popover is null, you need to add ref named popover on it.');
      }
      tooltip.reference = el;
    }
  }
};