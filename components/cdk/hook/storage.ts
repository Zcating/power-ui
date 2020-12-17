import { ref, watch } from 'vue';
import { usePlatform } from '../platform';
/**
 * get reactive value and controller in localstorage
 *
 * @export
 * @param {*} init
 * @param {string} key
 * @returns
 */
export function localStorageRef<T>(init: T, key: string) {
  const value = ref(init);

  const WINDOW = usePlatform()?.TOP;
  if (!WINDOW) {
    return value;
  }

  const localStorage = WINDOW.localStorage;

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
  }, { flush: 'sync', immediate: true });
  return value;
}

/**
 * get reactive value and controller in sessionstorage
 *
 * @export
 * @param {*} init
 * @param {string} key
 * @returns
 */
export function sessionStorageRef<T>(init: T, key: string) {
  const value = ref(init);

  const WINDOW = usePlatform()?.TOP;
  if (!WINDOW) {
    return value;
  }
  const sessionStorage = WINDOW.sessionStorage;

  const initFromSession = sessionStorage.getItem(key);
  if (initFromSession) {
    try {
      value.value = JSON.parse(initFromSession);
    } catch (err) {
      console.warn(`cannot red ${key} from localStorage`);
    }
  }
  watch(value, (val) => {
    sessionStorage.setItem(key, JSON.stringify(val));
  }, { flush: 'sync', immediate: true });

  return value;
}
