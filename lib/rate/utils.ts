import { isObject } from '../cdk/utils';

export type LevelMap = { [x: number]: { excluded: boolean, value: string } | string };

export function getValueFromMap(value: number, map: LevelMap) {
  const matchedKeys = Object.keys(map)
    .map(value => parseInt(value, 10))
    .filter(key => {
      const val = map[key];
      const excluded = isObject(val) ? val.excluded : false;
      return excluded ? value < key : value <= key;
    })
    .sort((a, b) => a - b);
  const matchedValue = map[matchedKeys[0]];
  return isObject(matchedValue) ? matchedValue.value : (matchedValue || '');
}