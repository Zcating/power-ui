export function toFixedNumber(value: number, precision: number) {
  const times = (10 ** precision) || 1;
  return Math.round(value * times / times);
}