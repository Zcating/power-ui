import { computed, defineComponent, ref, toRef } from 'vue';
import { watchRef } from 'vue-cdk/hook';
import { Method, Model } from 'vue-cdk/utils';
import { hsl2rgb, rgb2hsl } from './utils';

export const ColorInput = defineComponent({
  props: {
    hsl: {
      type: Model<{ h: number, s: number, l: number }>(),
      default: {}
    },
    'onUpdate:hsl': {
      type: Method<(hsl: { h: number, s: number, l: number }) => void>(),
      default: () => { }
    },
    alpha: {
      type: Number,
      default: 100
    },
    'onUpdate:alpha': {
      type: Method<(alpha: number) => void>(),
      default: () => { }
    }
  },
  setup(props, ctx) {

    const status = ref(0);
    const nextStatus = (index: number) => {
      const tmp = (status.value + index) % 3;
      status.value = tmp < 0 ? 3 + tmp : tmp;
    };

    const alpha = watchRef(
      toRef(props, 'alpha'),
      (value) => ctx.emit('update:alpha', value)
    );

    const hslRef = watchRef(
      toRef(props, 'hsl'),
      (value) => {
        ctx.emit('update:hsl', value);
      },
      true,
    );

    const rgb = watchRef(
      computed(() => {
        const hsl = props.hsl;
        return hsl2rgb(hsl.h, hsl.s, hsl.l);
      }),
      (value) => ctx.emit('update:hsl', rgb2hsl(value.r, value.g, value.b)),
      true
    );

    const switchStatus = () => {
      if (status.value === 1) {
        return (
          <div class="el-color-input__XXXA">
            <div class="item">
              <input v-model={rgb.value.r} />
              <div class="text">R</div>
            </div>
            <div class="item">
              <input v-model={rgb.value.g} />
              <div class="text">G</div>
            </div>
            <div class="item">
              <input v-model={rgb.value.b} />
              <div class="text">B</div>
            </div>
            <div class="item">
              <input v-model={alpha.value} />
              <div class="text">A</div>
            </div>
          </div>
        );
      } else if (status.value === 2) {
        return (
          <div class="el-color-input__XXXA">
            <div class="item">
              <input v-model={hslRef.value.h} />
              <div class="text">H</div>
            </div>
            <div class="item">
              <input v-model={hslRef.value.s} />
              <div class="text">S</div>
            </div>
            <div class="item">
              <input v-model={hslRef.value.l} />
              <div class="text">L</div>
            </div>
            <div class="item">
              <input v-model={alpha.value} />
              <div class="text">A</div>
            </div>
          </div>
        );
      } else {
        return (
          <div class="el-color-input__HEX">
            <input />
            <div class="text">HEX</div>
          </div>
        );
      }
    };

    return () => (
      <div class="el-color-input">
        <div class="el-color-input__main">
          {switchStatus()}
        </div>
        <div class="el-color-input__switch">
          <div
            class="item"
            onClick={() => nextStatus(-1)}
          >
            <i class="el-icon-arrow-up" />
          </div>
          <div
            class="item"
            onClick={() => nextStatus(1)}>
            <i class="el-icon-arrow-down" />
          </div>
        </div>
      </div>
    );
  }
});