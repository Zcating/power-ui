import { computed, defineComponent, ref, watch } from 'vue';
import { watchRef } from 'vue-cdk/hook';
import { Slider } from '../slider';
import { hsl2rgb, hexFrom, rgb2hsl, rgbaFromHashColor } from './utils';
import { SVPanel } from './sv-panel';
import { ColorInput } from './color-input';
import { Method } from 'vue-cdk/utils';

export const Pallet = defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '#ffffff33'
    },
    'onUpdate:modelValue': {
      type: Method<(value: string) => void>(),
    }
  },
  setup(props, ctx) {
    const rgba = rgbaFromHashColor(props.modelValue);

    const alphaRef = ref(rgba.a / 255 * 100);
    const alphaString = computed(() => hexFrom(alphaRef.value / 100 * 255));
    const hsl = ref(rgb2hsl(rgba.r, rgba.g, rgba.b));

    const modelRef = watchRef(
      computed(() => props.modelValue.toUpperCase()),
      (value) => ctx.emit('update:modelValue', value)
    );

    watch(hsl, (hslValue) => {
      const rgb = hsl2rgb(hslValue.h, hslValue.s, hslValue.l);
      modelRef.value = `#${hexFrom(rgb.r)}${hexFrom(rgb.g)}${hexFrom(rgb.b)}${alphaString.value}`;
    }, { deep: true });

    watch(alphaString, (value) => {
      modelRef.value = `${modelRef.value.substr(0, 7)}${value}`;
    });

    const hslColor = computed(() => {
      const { h, s, l } = hsl.value;
      return `hsl(${h}, ${s}%, ${l}%)`;
    });

    return () => (
      <div class={['el-pallet']}>
        <SVPanel
          hue={hsl.value.h}
          v-models={[
            [hsl.value.l, 'light'],
            [hsl.value.s, 'sat']
          ]}
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
            v-models={[
              [hsl.value.h, 'hue'],
              [hsl.value.s, 'sat'],
              [hsl.value.l, 'light'],
              [alphaRef.value, 'alpha'],
              [modelRef.value, 'hex']
            ]}
          />
        </div>
      </div>
    );
  }
});