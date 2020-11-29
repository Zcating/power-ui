import { ref, watch } from 'vue';
import Platform from './platform';

type BodyDirection = 'ltr' | 'rtl';

/**
 * rtl or ltr content directions
 *
 * @export
 * @class
 */
export default class {
  private directionRef = ref<BodyDirection>('ltr');

  get direction() {
    return this.directionRef.value;
  }

  set direction(value: BodyDirection) {
    this.directionRef.value = value;
  }

  constructor(platform: Platform) {
    const body = platform.BODY;
    if (!body) {
      return;
    }
    this.directionRef.value = (body.dir || 'ltr') as BodyDirection;
    watch(this.directionRef, (val) => {
      body.dir = val;
    });
  }
}
