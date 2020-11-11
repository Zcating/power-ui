import { inject, ref, watch } from "vue";
import { platformToken } from "../global";

/**
 * get reactive value and controller in localstorage
 *
 * @export
 * @param {*} init
 * @param {string} key
 * @returns
 */
export function localstorageRef(init: any, key: string) {
  const value = ref(init);
  const isBrowser = inject(platformToken)?.BROWSER;
  if (!isBrowser) return value;
  const initFromLocal = localStorage.getItem(key);
  if (initFromLocal) {
    try {
      value.value = JSON.parse(initFromLocal);
    } catch (err) {
      console.warn(`cannot red ${key} from localStorage`);
    }
  }
  watch(value, (val) => {
    localStorage.setItem(key, JSON.stringify(val));
  });
  return value;
}
