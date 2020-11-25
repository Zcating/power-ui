import { Directive } from 'vue';

export const vTooltip: Directive = {
  mounted(el, binding) {
    const instance = binding.instance;
    if (!instance || !instance.$refs) {
      return;
    }
    const tooltips = instance.$refs[binding.value] as any;
    if (tooltips && typeof tooltips === 'object' && tooltips.eltype === 'tooltip') {
      tooltips.reference = el;
    }
  }
};
