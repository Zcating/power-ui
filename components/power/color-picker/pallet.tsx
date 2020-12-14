import { computed, defineComponent, ref, toRef, watch } from 'vue';
import { watchRef } from 'vue-cdk/hook';
import { Slider } from '../slider';
import { hsl2rgb, hexFrom, rgb2hsl } from './utils';
import { SatPanel } from './sat-panel';
import { ColorInput } from './color-input';

export const Pallet = defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '#ffffff33'
    }
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const modelRef = watchRef(
      toRef(props, 'modelValue'),
      (value) => {
        ctx.emit('update:modelValue', value);
        console.log('value', value);
      },
      (value) => {
        const color = parseInt(value.substr(1, 8), 16);
        alphaRef.value = color & 0xff;
        hsl.value = rgb2hsl(color & 0xff000000, color & 0xff0000, color & 0xff00);
      },
    );

    const color = parseInt(props.modelValue.substr(1, 8), 16);

    const alphaRef = ref((color & 0xff) / 255 * 100);
    const alphaString = computed(() => hexFrom(Math.round(alphaRef.value * 255 / 100)));
    watch(alphaString, (value) => {
      modelRef.value = `${modelRef.value.substr(0, 7)}${value}`;
    });

    const hsl = ref(rgb2hsl(color & 0xff000000, color & 0xff0000, color & 0xff00));
    watch(hsl, (hslValue) => {
      const rgb = hsl2rgb(hslValue.h, hslValue.s, hslValue.l);
      modelRef.value = `#${hexFrom(rgb.r)}${hexFrom(rgb.g)}${hexFrom(rgb.b)}${alphaString.value}`;
    }, { deep: true });


    const hslColor = computed(() => {
      const { h, s, l } = hsl.value;
      return `hsl(${h}, ${s}%, ${l}%)`;
    });


    return () => (
      <div class={['el-pallet']}>
        <SatPanel
          hue={hsl.value.h}
          {...{
            light: hsl.value.l,
            'onUpdate:light': (value: number) => hsl.value.l = value,
            sat: hsl.value.s,
            'onUpdate:sat': (value: number) => hsl.value.s = value
          }}
        />
        <div class={['el-pallet__body']}>
          <div class={['el-pallet__control']}>
            <div class={['el-pallet__color']}>
              <div class="el-pallet__color--swatch">
                <div class="active" style={{ background: modelRef.value }} />
                <div class="background" />
              </div>
            </div>
            <div class={['el-pallet__sliders']}>
              <div class="el-pallet__slider hue">
                <Slider
                  v-model={hsl.value.h}
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
                  v-model={alphaRef.value}
                  enableTooltip={false}
                  max={100}
                  min={0}
                  step={0.1}
                  buttonClass={'el-pallet__slider--button'}
                  color={{
                    runway: `linear-gradient(to right, rgba(255, 255, 255, 0) 0%, ${hslColor.value} 100%), url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center`,
                    bar: 'rgba(0,0,0,0)'
                  }}
                />
              </div>
            </div>
          </div>
          <ColorInput
          // {...{
          //   hsl: hsl.value,
          //   'onUpdate:hsl': (value) => {
          //     console.log(value);
          //     hsl.value.h = value.h;
          //     hsl.value.l = value.l;
          //     hsl.value.s = value.s;
          //   },
          //   alpha: alphaRef.value,
          //   'onUpdate:alpha': (value) => {
          //     alphaRef.value = value;
          //   }
          // }}
          />
        </div>
      </div>
    );
  }
});