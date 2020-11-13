import { inject, ref, watch } from "vue";
import Platform from './platform';

/**
 * rtl or ltr content directions
 *
 * @export
 * @class
 */
export default class {
  direction = ref("ltr");
  constructor(platform: Platform) {
    const body = platform.BODY;
    if (!body) return;
    this.direction.value = body.dir || "ltr";
    watch(this.direction, (val) => {
      console.log(val);
      body.dir = val;
    });
  }
}
