import { defineComponent, onMounted, onUnmounted, reactive, Ref, ref } from 'vue';
import { usePlatform } from 'vue-cdk';
import { addEvent, Method } from 'vue-cdk/utils';
import { hsv2hsl } from './utils';

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

export const SatPanel = defineComponent({
  props: {
    hue: {
      type: Number,
      default: 0,
    },
    sat: {
      type: Number,
      default: 0
    },
    'onUpdate:sat': {
      type: Method<(v: number) => void>(),
      default: () => { }
    },
    light: {
      type: Number,
      default: 0
    },
    'onUpdate:light': {
      type: Method<(v: number) => void>(),
      default: () => { }
    }
  },
  setup(props, ctx) {
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
        props.hue,
        cursorStyle.left / rect.width * 100,
        100 - cursorStyle.top / rect.height * 100,

      );
      ctx.emit('update:sat', tmp.s);
      ctx.emit('update:light', tmp.l);
    });

    onMounted(() => {
      const svPanel = svPanelRef.value;
      if (!svPanel) {
        return;
      }
      const { clientWidth: width, clientHeight: height } = svPanel;

      cursorStyle.left = props.sat * width / 100;
      cursorStyle.top = props.light * height / 100;

    });

    return () => (
      <div
        class="el-pallet__saturation"
        style={{ background: `hsl(${props.hue}, 100%, 50%)` }} ref={svPanelRef}
      >
        <div class="el-pallet__saturation--white" />
        <div class="el-pallet__saturation--black" />
        <div
          class="el-pallet__saturation--cursor"
          style={{ top: `${cursorStyle.top}px`, left: `${cursorStyle.left}px` }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '6px',
              boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 1px inset',
              transform: 'translate(-6px, -8px)',
            }}
          />
        </div>
      </div>
    );
  }
});