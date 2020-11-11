// import { watchRef } from '@/cdk/hook';
// import { defineComponent, inject, ref, renderSlot, toRef } from "vue";
// import { OptionService } from './option.service';

// export const Option = defineComponent({
//   props: {
//     value: {
//       required: true
//     },
//     label: [String, Number],
//     created: {
//       type: Boolean,
//       default: false,
//     },
//     disabled: {
//       type: Boolean,
//       default: false
//     }
//   },

//   setup(props, ctx) {
//     const elDisabled = watchRef(toRef(props, 'disabled'));
//     const hover = ref(false);
//     const limitReached = ref(false);

//     const service = inject(OptionService.key);
//     if (service) {
//       service.watchDisabled((value) => elDisabled.value = value);
//     }
    
//     return {
//       elDisabled,
//       hover,
//       limitReached,
//       hoverItem,
//       selectOptionClick,
//       itemSelected,
//     };
//   },

//   render() {
//     const {
//       $slots,
//       currentLabel,
//       hoverItem,
//       selectOptionClick,
//       itemSelected,
//       elDisabled,
//       limitReached,
//       hover
//     } = this;
//     return (
//       <li
//         onMouseenter={hoverItem}
//         onClick={selectOptionClick}
//         class={["el-select-dropdown__item", {
//           'selected': itemSelected,
//           'is-disabled': elDisabled || limitReached,
//           'hover': hover
//         }]}
//       >
//         {renderSlot($slots, 'default')}
//         <span>{currentLabel}</span>
//       </li>
//     );
//   }
// });