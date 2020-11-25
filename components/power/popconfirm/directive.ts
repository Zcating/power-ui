import { Directive } from 'vue';
export const vPopconfirm: Directive = {
  mounted(el, binding) {
    const instance = binding.instance;
    if (!instance || !instance.$refs) {
      return;
    }
    const popconfirm = instance.$refs[binding.value] as any;
    if (popconfirm && typeof popconfirm === 'object' && popconfirm.eltype === 'popconfirm') {
      const popover = popconfirm.$refs.popover;
      if (!popover) {
        throw Error('Popconfirm\'s popover is null, you need to add ref named popover on it.');
      }
      popover.$refs.tooltip.reference = el;
    }
  }
};