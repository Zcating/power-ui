import { computed, defineComponent, reactive, watch, watchEffect } from 'vue';
import { Slider } from '../slider';

export const Pallet = defineComponent({
  setup(props, ctx) {
    const hsl = reactive({
      h: 100,
      s: 100,
      l: 35,
      alpha: 100
    });

    const hslColor = computed(() => {
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    });

    const sampleColor = computed(() => {
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${hsl.alpha}%)`;
    });

    const cursorStyle = reactive({
      top: 0,
      left: 0,
    });

    const hsl2hsv = (hue: number, sat: number, light: number)  => {
      sat = sat / 100;
      light = light / 100;
      let smin = sat;
      const lmin = Math.max(light, 0.01);
    
      light *= 2;
      sat *= (light <= 1) ? light : 2 - light;
      smin *= lmin <= 1 ? lmin : 2 - lmin;
      const v = (light + sat) / 2;
      const sv = light === 0 ? (2 * smin) / (lmin + smin) : (2 * sat) / (light + sat);
    
      return {
        h: hue,
        s: sv * 100,
        v: v * 100
      };
    };

    watch(() => hsl.h, () => {
      const hsv = hsl2hsv(hsl.h, hsl.l, hsl.s);
      cursorStyle.left = hsv.s;
    }, {immediate: true});
    watch(() => hsl.l, () => {
      const hsv = hsl2hsv(hsl.h, hsl.l, hsl.s);      
      cursorStyle.top = hsv.v;
    }, {immediate: true});

    const handleClick = (event: MouseEvent) => {
      console.log(event.target);

    };

    return () => (
      <div class={['el-pallet']}>
        <div class={['el-pallet__saturation']} style={{ background: `hsl(${hsl.h}, 100%, 50%)` }} onClick={handleClick}>
          <div class="el-pallet__saturation--white" />
          <div class="el-pallet__saturation--black" />
          <div class="el-pallet__saturation--cursor" style={{top: `${cursorStyle.top}%`, left: `${cursorStyle.left}%`}}>
            <div 
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '6px',
                boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 1px inset',
                transform: 'translate(-6px, -8px)',
              }}
            ></div>
          </div>
        </div>
        <div class={['el-pallet__body']}>
          <div class={['el-pallet__control']}>
            <div class={['el-pallet__color']}>
              <div class="el-pallet__color--swatch">
                <div class="active" style={{background: sampleColor.value}}/>
                <div class="background" />
              </div>
            </div>
            <div class={['el-pallet__sliders']}>
              <div class="el-pallet__slider hue">
                <Slider
                  v-model={hsl.h}
                  enableTooltip={false}
                  max={359}
                  min={0}
                  step={1}
                  buttonClass={'el-pallet__slider--button'}
                  color={{
                    runway: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
                    bar: 'rgba(0,0,0,0)'
                  }}
                />
              </div>
              <div class="el-pallet__slider alpha">
                <Slider
                  v-model={hsl.alpha}
                  enableTooltip={false}
                  max={100}
                  min={0}
                  step={0.1}
                  buttonClass={'el-pallet__slider--button'}
                  color={{
                    runway: `linear-gradient(to right, rgba(255, 0, 4, 0) 0%, ${hslColor.value} 100%), url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center`,
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