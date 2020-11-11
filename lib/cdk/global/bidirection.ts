import { inject, ref, watch } from "vue";
import { platformToken } from ".";

/**
 * rtl or ltr content directions
 *
 * @export
 * @class
 */
export default class {
  direction = ref("ltr");
  constructor() {
    const body = inject(platformToken)!.BODY;
    if (!body) return;
    this.direction.value = body.dir || "ltr";
    watch(this.direction, (val) => {
      console.log(val);
      body.dir = val;
    });
  }
}
