import { computed, defineComponent, onMounted, onUnmounted, reactive, Ref, ref, toRef, watch } from 'vue';
import { usePlatform } from 'vue-cdk';
import { watchRef } from 'vue-cdk/hook';
import { addEvent } from 'vue-cdk/utils';
import { Slider } from '../slider';
import { hsl2hsv, hsl2rgba, hsv2hsl, rgb2hsl } from './utils';

const useDraggable = (eleRef: Ref<HTMLElement | null>, onDrag: (event: MouseEvent) => void) => {
  onMounted(() => {
    const { DOCUMENT } = usePlatform();
    const panel = eleRef.value;
    if (!DOCUMENT || !panel) {
      return;
    }
    const stopMouseDown = addEvent(panel, 'mousedown', () => {
      let isDragging = false;
      if (isDragging) {
        return;
      }
      isDragging = true;
      DOCUMENT.onselectstart = function () { return false; };
      DOCUMENT.ondragstart = function () { return false; };

      const removed = [
        addEvent(DOCUMENT, 'mousemove', onDrag),
        addEvent(DOCUMENT, 'mouseup', (event) => {
          removed.forEach((value) => value());
          document.onselectstart = null;
          document.ondragstart = null;

          isDragging = false;
          onDrag(event);
        })
      ];
    });
    onUnmounted(() => {
      stopMouseDown();
    });
  });
};

export const Pallet = defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '#00000000'
    }
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const modelRef = watchRef(toRef(props, 'modelValue'), (value) => {
      ctx.emit('update:modelValue', value);
      console.log(value);
    });
    const hsl = reactive({
      h: 100,
      s: 100,
      l: 35,
      alpha: 100
    });
    function toHex(d: number) {
      return ('0' + (d.toString(16))).slice(-2);
    }
    watch(() => hsl, (hslValue) => {
      const rgb = hsl2rgba(hslValue.h, hslValue.l, hslValue.s);
      modelRef.value = `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}${toHex(Math.round(hslValue.alpha * 255 / 100))}`;
    }, { deep: true });

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

    const svPanelRef = ref<HTMLDivElement | null>(null);
    useDraggable(svPanelRef, (event: MouseEvent) => {
      const svPanel = svPanelRef.value;
      if (!svPanel) {
        return;
      }
      const rect = svPanel.getBoundingClientRect();
      const left = event.clientX - rect.left;
      const top = event.clientY - rect.top;
      cursorStyle.left = Math.min(Math.max(0, left), rect.width);
      cursorStyle.top = Math.min(Math.max(0, top), rect.height);
      const tmp = hsv2hsl(
        hsl.h,
        cursorStyle.left / rect.width * 100,
        100 - cursorStyle.top / rect.height * 100
      );
      hsl.s = tmp.s;
      hsl.l = tmp.l;
    });

    return () => (
      <div class={['el-pallet']}>
        <div class="el-pallet__saturation" style={{ background: `hsl(${hsl.h}, 100%, 50%)` }} ref={svPanelRef}>
          <div class="el-pallet__saturation--white" />
          <div class="el-pallet__saturation--black" />
          <div class="el-pallet__saturation--cursor" style={{ top: `${cursorStyle.top}px`, left: `${cursorStyle.left}px` }}>
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
                <div class="active" style={{ background: sampleColor.value }} />
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