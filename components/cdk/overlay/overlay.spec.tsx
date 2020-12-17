import { ResizeObserver } from '@juggle/resize-observer';
import { CSSProperties, defineComponent, onBeforeUnmount, onMounted, ref, Teleport } from 'vue';
export const OverlayTester = defineComponent({
  setup(_, ctx) {
    const originRef = ref<HTMLElement>();
    const panelRef = ref<HTMLElement>();
    const panelStyle = ref<CSSProperties>({ position: 'absolute' });
    const handleClick = () => {
      const origin = originRef.value;
      if (origin) {
        origin.style.top = `${Math.random() * 500 % 500}px`;
        origin.style.left = `${Math.random() * 500 % 500}px`;
      }
    };
    onMounted(() => {
      const origin = originRef.value;
      const panel = panelRef.value;
      if (!origin || !panel) {
        return;
      }

      const calculate = () => {
        const rect = origin.getBoundingClientRect();
        // 原点为 origin 元素的底边中央正下方
        const originX = rect.left + (rect.width / 2);
        const originY = rect.bottom;

        // panel的坐标为到原点的偏移
        const panelRect = panel.getBoundingClientRect();
        const panelX = originX - panelRect.width / 2;
        const panelY = originY;

        panelStyle.value.left = `${panelX}px`;
        panelStyle.value.top = `${panelY}px`;
      };
      calculate();

      const origin$ = new MutationObserver(calculate);
      origin$.observe(origin, {
        // 只需要拿到 attribute 的 style 的变化即可
        attributeFilter: ['style'],
      });

      const panel$ = new ResizeObserver(calculate);
      panel$.observe(panel);

      window.addEventListener('scroll', calculate, true);
      window.addEventListener('resize', calculate);

      // dom销毁前取消监听
      onBeforeUnmount(() => {
        origin$.disconnect();
        panel$.disconnect();
        window.removeEventListener('scroll', calculate, true);
        window.removeEventListener('resize', calculate);
      });
    });

    return () => (
      <>
        <div style={{ position: 'absolute', }} />
        <button onClick={handleClick}>click me</button>
        <div style={{ position: 'absolute' }} ref={originRef}>origin</div>
        <Teleport to="#cdk-overlay-anchor">
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, height: '100vh', width: '100vw', pointerEvents: 'none' }}>
            <div ref={panelRef} style={panelStyle.value}>test</div>
          </div>
        </Teleport>
      </>
    );
  }
});

// export default OverlayTester;
// let compo: VueWrapper<any>;
// beforeEach(() => {
//   compo = mount(OverlayTester);
// });
// describe('cdk-virtual-scroll', () => {
//   it('will mount successfully', () => {
//     expect(compo).toBeTruthy();
//   });
// });
