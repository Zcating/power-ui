import { Directive } from 'vue';

export const tooltipDirectiveFactory: (type: string) => Directive = (type: string) => ({
  mounted(el, binding) {
    const instance = binding.instance;
    if (!instance || !instance.$refs) {
      return;
    }
    const tooltips = instance.$refs[binding.value] as any;
    if (tooltips && typeof tooltips === 'object' && tooltips.eltype === type) {
      tooltips.reference = el;
    }
  }
});

export const vTooltip = tooltipDirectiveFactory('tooltip');

