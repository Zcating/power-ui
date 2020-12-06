import { defineComponent, Transition } from 'vue';

const Collapse = {
  onBeforeEnter(el: any) {
    el.classList.add('collapse-transition');

    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;

    el.style.height = '0';
    el.style.paddingTop = '0';
    el.style.paddingBottom = '0';
  },

  onEnter(el: any) {
    el.dataset.oldOverflow = el.style.overflow;
    if (el.scrollHeight !== 0) {
      el.style.height = el.scrollHeight + 'px';
      el.style.paddingTop = el.dataset.oldPaddingTop ?? 'unset';
      el.style.paddingBottom = el.dataset.oldPaddingBottom ?? 'unset';
    } else {
      el.style.height = '';
      el.style.paddingTop = el.dataset.oldPaddingTop ?? 'unset';
      el.style.paddingBottom = el.dataset.oldPaddingBottom ?? 'unset';
    }

    el.style.overflow = 'hidden';
  },

  onAfterEnter(el: any) {
    // for safari: remove class then reset height is necessary
    el.classList.remove('collapse-transition');
    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow ?? 'unset';
  },

  onBeforeLeave(el: any) {
    // if (!el.dataset) el.dataset = {};
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.dataset.oldOverflow = el.style.overflow;

    el.style.height = el.scrollHeight + 'px';
    el.style.overflow = 'hidden';
  },

  onLeave(el: any) {
    if (el.scrollHeight !== 0) {
      // for safari: add class after set height, or it will jump to zero height suddenly, weired
      el.classList.add('collapse-transition');
      el.style.height = '0';
      el.style.paddingTop = '0';
      el.style.paddingBottom = '0';
    }
  },

  onAfterLeave(el: any) {
    el.classList.remove('collapse-transition');
    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow ?? 'unset';
    el.style.paddingTop = el.dataset.oldPaddingTop ?? 'unset';
    el.style.paddingBottom = el.dataset.oldPaddingBottom ?? 'unset';
  },
};

export default defineComponent({
  name: 'po-collapse-transition',
  setup(_, ctx) {
    return () => (
      <Transition {...Collapse}>
        {ctx.slots.default?.()}
      </Transition>
    );
  }
});