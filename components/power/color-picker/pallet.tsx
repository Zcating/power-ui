import { defineComponent, ref } from 'vue';
import { Slider } from '../slider';

export const Pallet = defineComponent({
  setup(props, ctx) {
    const rgbColor = ref('#00bbaa');
    const rgbPercent = ref(0);
    const alphaPercent = ref(0);
    return () => (
      <div class={['el-pallet']}>
        <div class={['el-pallet__saturation']} style={{ background: rgbColor.value }}>
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
                  v-model={rgbPercent.value}
                  max={100}
                  min={0}
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
                  max={100}
                  min={0}
                  buttonClass={'el-pallet__slider--button'}
                  color={{
                    runway: `linear-gradient(to right, rgba(255, 0, 4, 0) 0%, ${rgbColor.value} 100%)`,
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