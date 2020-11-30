export { PowerViewProvider } from './power-view-provider';
export { default as Alert } from './alert';
export { default as Avatar } from './avatar';
export { Button, ButtonGroup } from './button';
export { default as Backtop } from './backtop';
export { default as Badge } from './badge';
export { Breadcrumb, BreadcrumbItem } from './breadcrumb';
export { default as Calendar } from './calendar';
export { Dialog } from './dialog';
export { Popover, vPopover } from './popover';
export { Tooltip, vTooltip } from './tooltip';
export { Tag } from './tag';
export { Popconfirm, vPopconfirm } from './popconfirm';
export { Progress } from './progress';
export { Upload } from './upload';
export { Switch } from './switch';
export { Steps, Step } from './steps';
export { Radio, RadioButton, RadioGroup } from './radio';
export { Spinner } from './spinner';
export { Drawer } from './drawer';
export { Input } from './input';
export { Card } from './card';
export { Select, SelectOption, SelectOptionGroup } from './select';
export { Slider } from './slider';
export { Rate } from './rate';
export { Checkbox, CheckboxGroup, CheckboxButton, CheckboxGroupRef } from './checkbox';
export { useMessage } from './message';
export { useNotification } from './notification';
export { Transfer } from './transfer';
export { Form, FormItem } from './form';




// add language provider
// const langValue = ref('zhCN');
// const cdkLang: ComputedRef<lang.LangConfig> = computed(() => {
//   if (langValue.value === 'index') {
//     return lang.zhCN;
//   }
//   return (lang as any)[langValue.value] || lang.zhCN;
// });
// watch(
//   cdkLang,
//   (res) => {
//     // get week name ignore shor/long
//     const weeks = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(
//       (el) => (res.datepicker.weeks as any)[el]
//     ) as Days;
//     const months = [
//       'jan',
//       'feb',
//       'mar',
//       'apr',
//       'may',
//       'jun',
//       'jul',
//       'aug',
//       'sep',
//       'oct',
//       'nov',
//       'dec',
//     ].map((el) => (res.datepicker.months as any)[el]) as Months;
//     const shortMonths = new Array(12).map(
//       (_, index) => (res.datepicker as any)['month' + (index + 1)]
//     ) as Months;
//     setGlobalDateI18n({
//       dayNamesShort: weeks,
//       dayNames: weeks,
//       monthNamesShort: shortMonths,
//       monthNames: months,
//       amPm: ['am', 'pm'],
//     });
//   },
//   { immediate: true }
// );
// provide(langToken, cdkLang);
// provide(setLangToken, langValue);