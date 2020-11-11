// import { isEquals, List, renderCondition } from '../cdk/utils';
// import { computed, defineComponent, getCurrentInstance, Ref, ref, renderSlot, SetupContext, toRef } from "vue";
// import { Tooltip, vTooltip } from '@/tooltip';
// // import { TagInput } from './tag-input';
// import { Input } from '../input';

// function useClear(
//   ctx: SetupContext,
//   inputValue: Ref<any>,
//   visible: Ref<boolean>,
//   remote: Ref<boolean>,
//   filterable: Ref<boolean>,
//   multiple: Ref<boolean>
// ) {
//   const iconClass = computed(() => {
//     return remote.value && filterable.value ? '' : (visible.value ? 'arrow-up is-reverse' : 'arrow-up');
//   });

//   const onClear = (event: Event) => {
//     event.stopPropagation();
//     const value = multiple.value ? [] : '';
//     if (!isEquals(inputValue, value)) {
//       ctx.emit('change', value);
//     }
//     ctx.emit('input', value);
//     ctx.emit('clear');
//     visible.value = false;
//   }

//   return {
//     iconClass,
//     onClear
//   }
// }


// export const Select = defineComponent({
//   directives: {
//     tooltip: vTooltip,
//   },
//   props: {
//     name: String,
//     id: String,
//     modelValue: {
//       type: [Boolean, String, Number, List<any>()],
//       required: true,
//     },
//     autocomplete: {
//       type: String,
//       default: 'off'
//     },
//     automaticDropdown: Boolean,
//     size: String,
//     disabled: Boolean,
//     clearable: Boolean,
//     filterable: Boolean,
//     allowCreate: Boolean,
//     loading: Boolean,
//     popperClass: String,
//     remote: Boolean,
//     loadingText: String,
//     noMatchText: String,
//     noDataText: String,
//     remoteMethod: Function,
//     filterMethod: Function,
//     multiple: Boolean,
//     multipleLimit: {
//       type: Number,
//       default: 0
//     },
//     placeholder: {
//       type: String,
//       default: 'el.select.placeholder',
//     },
//     defaultFirstOption: Boolean,
//     reserveKeyword: Boolean,
//     valueKey: {
//       type: String,
//       default: 'value'
//     },
//     collapseTags: Boolean,
//   },

//   setup(props) {

//     const emptyText = computed(() => '');

//     const visible = ref(false);

//     const selectDisabled = toRef(props, 'disabled');

//     const menuVisibleOnFocus = ref(false);

//     const instance = getCurrentInstance();

//     const toggleMenu = () => {

//     }

//     return {
//       emptyText,
//       collapseTagSize: '',
//       selectSize: '',
//       inputWidth: 100,
//       selected: [],
//       selectDisabled: false,
//       inputLength,
//       visible,
//       filteredOptionsCount,
//       inputValue,
//       toggleMenu,
//     }
//   },

//   render() {
//     const {
//       id,
//       multiple,
//       filterable,
//       placeholder,
//       readonly,
//       collapseTags,
//       loading,
//       allowCreate,
//       autocomplete,
//       emptyText,
//       collapseTagSize,
//       selectSize,
//       inputWidth,
//       selected,
//       selectDisabled,
//       inputLength,
//       visible,
//       filteredOptionsCount,
//       inputValue,
//       iconClass,
//       showClose,
//       toggleMenu
//     } = this;
//     return (
//       <div
//         class={["el-select", selectSize ? 'el-select--' + selectSize : '']}
//         onClick={/*stop*/ toggleMenu}
//         v-tooltip="tooltip"
//       >
//         {/* {renderCondition(
//           multiple,
//           <TagInput
//             v-model={this.inputValue}
//             inputWidth={inputWidth}
//             inputLength={inputLength}
//             collapseTags={collapseTags}
//             collapseTagSize={collapseTagSize}
//             selected={selected}
//             selectDisabled={selectDisabled}
//             selectSize={selectSize}
//             filterable={filterable}
//             autoComplete={autocomplete}
//           />
//         )} */}

//         <Input
//           ref="reference"
//           v-model={selectedLabel}
//           type="text"
//           placeholder={placeholder}
//           name={name}
//           id={id}
//           autocomplete={autocomplete}
//           size={selectSize}
//           disabled={selectDisabled}
//           readonly={readonly}
//           validate-event="false"
//           class="{ 'is-focus': visible }"
//           tabindex={(multiple && filterable) ? -1 : undefined}
//           focus="handleFocus"
//           blur="handleBlur"
//           // keyup.native="debouncedOnInputChange"
//           // keydown.native.down.stop.prevent="navigateOptions('next')"
//           // @keydown.native.up.stop.prevent="navigateOptions('prev')"
//           // @keydown.native.enter.prevent="selectOption"
//           // @keydown.native.esc.stop.prevent="visible = false"
//           // @keydown.native.tab="visible = false"
//           // @paste.native="debouncedOnInputChange"
//           // @mouseenter.native="inputHovering = true"
//           // @mouseleave.native="inputHovering = false"
//           v-slots={{
//             prefix: () => this.$slots.prefix,
//             suffix: () => [
//               <i v-show={!showClose} class={['el-select__caret', 'el-input__icon', 'el-icon-' + iconClass]} />,
//               renderCondition(showClose, <i class="el-select__caret el-input__icon el-icon-circle-close" onClick={handleClearClick} />)
//             ],
//           }}
//         />

//         <Tooltip
//           ref="tooltip"
//           disabled={visible}
//           transition="el-zoom-in-top"
//           effect="light"
//           trigger="click"
//           popperClass={['el-select-dropdown', multiple ? 'is-multiple' : '']}
//         >
//           <div class="el-select-dropdown__wrap">
//             <ul
//               v-show={options.length > 0 && !loading}
//               class={['el-select-dropdown__list', { 'is-empty': !allowCreate && inputValue && filteredOptionsCount === 0 }]}
//             >
//               {/* {renderCondition(
//                 showNewOption,
//                 <ElOption value="query" created/>
//               )} */}
//               {renderSlot(this.$slots, 'default')}
//             </ul>
//           </div>
//           {renderCondition(
//             emptyText && (!allowCreate || loading || (allowCreate && options.length === 0)),
//             renderCondition(
//               this.$slots.empty,
//               renderSlot(this.$slots, 'empty'),
//               <p class="el-select-dropdown__empty" v-else>
//                 {emptyText}
//               </p>
//             )
//           )}
//         </Tooltip>
//       </div >
//     );
//   }
// });