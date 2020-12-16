import { CSSProperties, defineComponent, onMounted, ref, Teleport } from 'vue';
export const OverlayTester = defineComponent({
  // name: 'overlay-spec',
  setup(_, ctx) {
    const originRef = ref<HTMLElement>();
    const panelRef = ref<HTMLElement>();
    const pannelStyle = ref<CSSProperties>({ position: 'absolute' });

    onMounted(() => {
      const panelValue = panelRef.value;
      const originValue = originRef.value;
      if (!panelValue && !originValue) {
        return;
      }


    });

    return () => (
      <>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '200vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div ref={originRef}>origin</div>
        </div>
        <div ref={origin}>origin</div>
        <Teleport to="#cdk-overlay-anchor">
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, height: '100vh', width: '100vw' }}>
            <div ref={panelRef} style={pannelStyle.value}></div>
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
