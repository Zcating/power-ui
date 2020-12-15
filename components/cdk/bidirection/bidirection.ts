import { Platform } from '../platform';

type BodyDirection = 'ltr' | 'rtl';

/**
 * rtl or ltr content directions
 *
 * @export
 * @class
 */
export class Bidirection {
  get direction() {
    return (this.platform.BODY?.dir ?? 'ltr') as BodyDirection;
  }

  set direction(value: BodyDirection) {
    this.platform.BODY && (this.platform.BODY.dir = value);
  }

  constructor(private platform: Platform) {
  }
}
