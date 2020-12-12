import { computed, defineComponent, ref } from 'vue';
import { Slider } from '../slider';

const caculateHue = (x: number) => {
  if (x <= 0) {
    return 0;
  } else if (x < 100) {
    return x * 360 / 100;
  } else if (100 <= x) {
    return 359;
  }
};

// class Color {
//   private red: number;
//   private green: number;
//   private blue: number;
//   private alpha: number;

//   constructor(value: string);
//   constructor(value: number, alpha: number);
//   constructor(value: number | string, alpha?: number) {
//     if (typeof value === 'number') {
//       this.blue = value & 0xff;
//       this.green = value & 0xff00;
//       this.red = value & 0xff0000;
//       this.alpha = alpha ?? 1;
//     } else if (!!value.match(/rgb(a){0,1}/)) {
//       const rgba = /rgb(a){0,1}\(([\d\.]+),(\s*([\d\.]+)%,){1,2}(\s*([\d\.]+)%)\)/g.exec(value);
//       if (!rgba) {
//         throw Error(`[power-ui][color]: Please check your input '${value}'.`);
//       }
      
//     } else if (!!value.match(/hsl/)) {
//       const hsl = /hsl\(([\d\.]+),(\s*([\d\.]+)%,){1,2}(\s*([\d\.]+)%)\)/g.exec(value);
//       if (!hsl) {
//         throw Error(`[power-ui][color]: Please check your input '${value}'.`);
//       }
//       const h = parseInt(hsl[1]) / 360 ?? 0;
//       const s = parseInt(hsl[2]) / 100 ?? 50;
//       const l = parseInt(hsl[3]) / 100 ?? 50;
//       this.alpha = parseInt(hsl[4]) / 100 ?? 1;

//       function hue2rgb(p: number, q: number, t: number) {
//         if (t < 0) t += 1;
//         if (t > 1) t -= 1;
//         if (t < 1/6) return p + (q - p) * 6 * t;
//         if (t < 1/2) return q;
//         if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
//         return p;
//       }
      
//       if (s == 0) {
//         this.red = this.green = this.blue = l;
//       } else {
//         const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
//         const p = 2 * l - q;
//         this.red = hue2rgb(p, q, h + 1/3);
//         this.green = hue2rgb(p, q, h);
//         this.blue = hue2rgb(p, q, h - 1/3);
//       }
//     } else if (!!value.match(/()/)) {

//     } else {
//       throw Error(`[power-ui][color]: Please check your input '${value}'.`);
//     }
//   }

//   rgba() {
//     return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
//   }

//   hsl() {
//     // function hue2rgb(p, q, t) {
//     //   if (t < 0) t += 1;
//     //   if (t > 1) t -= 1;
//     //   if (t < 1/6) return p + (q - p) * 6 * t;
//     //   if (t < 1/2) return q;
//     //   if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
//     //   return p;
//     // }
//     // let r, g, b;
//     // if (s == 0) {
//     //   r = g = b = l;
//     // } else {
//     //   const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
//     //   const p = 2 * l - q;
//     //   r = hue2rgb(p, q, h + 1/3);
//     //   g = hue2rgb(p, q, h);
//     //   b = hue2rgb(p, q, h - 1/3);
//     // }
//     // return `rgb(${r * 255},${g * 255},${b * 255})`;
//   }
// }

export const Pallet = defineComponent({
  setup(props, ctx) {
    const huePercent = ref(0);
    const alphaPercent = ref(100);
    const hslColor = computed(() => {
      return `hsl(${caculateHue(huePercent.value)}, 50%, 50%)`;
    });



    return () => (
      <div class={['el-pallet']}>
        <div class={['el-pallet__saturation']} style={{ background: hslColor.value }}>
          <div class="el-pallet__saturation--white" />
          <div class="el-pallet__saturation--black" />
          <div class="el-pallet__saturation--cursor" />
        </div>
        <div class={['el-pallet__body']}>
          <div class={['el-pallet__control']}>
            <div class={['el-pallet__color']}>
              <div class="el-pallet__color--swatch">
                <div class="active">

                </div>
              </div>
            </div>
            <div class={['el-pallet__sliders']}>
              <div class="el-pallet__slider hue">
                <Slider
                  v-model={huePercent.value}
                  enableTooltip={false}
                  max={100}
                  min={0}
                  step={0.1}
                  buttonClass={'el-pallet__slider--button'}
                  color={{
                    runway: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
                    bar: 'rgba(0,0,0,0)'
                  }}
                />
              </div>
              <div class="el-pallet__slider alpha">
                <Slider
                  v-model={alphaPercent.value}
                  enableTooltip={false}
                  max={100}
                  min={0}
                  step={0.1}
                  buttonClass={'el-pallet__slider--button'}
                  color={{
                    runway: `linear-gradient(to right, rgba(255, 0, 4, 0) 0%, ${hslColor.value} 100%)`,
                    bar: 'rgba(0,0,0,0)'
                  }}
                />
              </div>
            </div>
          </div>
          <div>

          </div>
        </div>
      </div>
    );
  }
});