// import { vmodelRef } from '../cdk/hook';
// import { List, Model } from '../cdk/utils';
// import { computed, defineComponent, Prop, reactive, ref, renderList, toRef } from 'vue';

// export type RateSection = {
//   [k in number]: { value: string, exclude: boolean } | string
// }

// type RateProps = InstanceType<typeof Rate>['$props'];

// function computeSection(name: 'colors' | 'iconClasses', props: RateProps) {
//   return computed<RateSection>(() => {
//     const target = props[name];
//     return Array.isArray(target)
//       ? {
//         [props.lowThreshold!]: target[0],
//         [props.highThreshold!]: { value: target[1], excluded: true },
//         [props.max!]: target[2]
//       } : target;
//   });
// }

// export const Rate = defineComponent({
//   name: 'el-rate',
//   props: {
//     modelValue: {
//       type: Number,
//       default: 0
//     },
//     lowThreshold: {
//       type: Number,
//       default: 2
//     },
//     highThreshold: {
//       type: Number,
//       default: 4
//     },
//     max: {
//       type: Number,
//       default: 5
//     },
//     colors: {
//       type: [Array, Object],
//       default: ['#F7BA2A', '#F7BA2A', '#F7BA2A']
//     },
//     voidColor: {
//       type: String,
//       default: '#C6D1DE'
//     },
//     disabledVoidColor: {
//       type: String,
//       default: '#EFF2F7'
//     },
//     iconClasses: {
//       type: [Array, Object],
//       default: () => ['el-icon-star-on', 'el-icon-star-on', 'el-icon-star-on']
//     },
//     voidIconClass: {
//       type: String,
//       default: 'el-icon-star-off'
//     },
//     disabledVoidIconClass: {
//       type: String,
//       default: 'el-icon-star-on'
//     },
//     disabled: {
//       type: Boolean,
//       default: false
//     },
//     allowHalf: {
//       type: Boolean,
//       default: false
//     },
//     showText: {
//       type: Boolean,
//       default: false
//     },
//     showScore: {
//       type: Boolean,
//       default: false
//     },
//     textColor: {
//       type: String,
//       default: '#1f2d3d'
//     },
//     texts: {
//       type: List<string>(),
//       default: () => ['极差', '失望', '一般', '满意', '惊喜']
//     },
//     scoreTemplate: {
//       type: String,
//       default: '{value}'
//     }
//   },

//   setup(props, ctx) {
//     const currentValue = vmodelRef(toRef(props, 'modelValue'), value => {
//       ctx.emit('update:modelValue', value);
//     });
//     const rateDisabled = toRef(props, 'disabled');
//     const texts = ref([]);
//     const text = computed(() => {
//       let result = '';
//       const current = currentValue.value;
//       if (props.showScore) {
//         const value = rateDisabled.value ? props.modelValue : current;
//         result = props.scoreTemplate.replace(/\{\s*value\s*\}/, `${value}`);
//       } else if (props.showText) {
//         result = texts.value[Math.ceil(current) - 1];
//       }
//       return result;
//     });

//     const handleKey = () => {

//     };

//     const state = reactive({
//       hoverIndex: 0,

//     });

//     const setCurrentValue = (item: number, event: Event) => {
//       if (rateDisabled.value) {
//         return;
//       }
//       if (props.allowHalf) {
//         const target = event.target as HTMLSpanElement;
//         if (target.classList.contains('el-rate__item')) {
//           const icon = target.querySelector('.el-rate__icon');
//         }

//         if (target.classList.contains('el-rate__decimal')) {
//           const parent = target.parentNode;
//         }

//         this.pointerAtLeftHalf = event.offsetX * 2 <= target.clientWidth;
//         this.currentValue = this.pointerAtLeftHalf ? value - 0.5 : value;
//       } else {
//         this.currentValue = value;
//       }
//       state.hoverIndex = value;
//     };

//     const resetCurrentValue = () => {
//     };

//     const selectValue = (item: number) => {
//       if (rateDisabled.value) {
//         return;
//       }
//       if (props.allowHalf) {

//       }
//     };


//     const colorSection = computeSection('colors', props);

//     const getValueFromMap = (value: number, section: ColorSection) => {
//       const matchedKeys = Object.keys(map)
//         .filter(key => {
//           const val = map[key];
//           const excluded = isObject(val) ? val.excluded : false;
//           return excluded ? value < key : value <= key;
//         })
//         .sort((a, b) => a - b);
//       const matchedValue = map[matchedKeys[0]];
//       return isObject(matchedValue) ? matchedValue.value : (matchedValue || '');
//     };
//     const activeColor = computed(() => {
//       return getValueFromMap(this.currentValue, this.colorMap);
//     });



//     const getIconStyle = (item: number) => {
//       const voidColor = rateDisabled.value ? props.disabledVoidColor : props.voidColor;
//       return {
//         color: item <= currentValue.value ? props.activeColor : voidColor
//       };
//     };

//     return () => (
//       <div
//         class="el-rate"
//         role="slider"
//         onKeydown={handleKey}
//         aria-valuenow={currentValue.value}
//         aria-valuetext={text.value}
//         aria-valuemin={0}
//         aria-valuemax={props.max}
//         tabindex={0}
//       >
//         {renderList(props.max, (item, key) => {
//           <span
//             class="el-rate__item"
//             onMousemove={($event) => setCurrentValue(item, $event)}
//             onMouseleave={resetCurrentValue}
//             onClick={() => selectValue(item)}
//             style={{ cursor: rateDisabled.value ? 'auto' : 'pointer' }}
//             key={key}
//           >
//             <i
//               class={['el-rate__icon', classes[item - 1], { 'hover': state.hoverIndex === item }]}
//               style={getIconStyle(item)}
//             >
//               <i
//                 v-if="showDecimalIcon(item)"
//                 class={['el-rate__decimal', decimalIconClass]}
//                 style="decimalStyle"
//               />
//             </i>
//           </span>;
//         })}
//         <span v-if="showText || showScore" class="el-rate__text" style="{ color: textColor }">{text}</span>
//       </div>
//     );
//   },
// });
