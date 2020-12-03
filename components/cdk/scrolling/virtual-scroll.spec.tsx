import { defineComponent } from 'vue';
import { VirtualScrollable } from './virtual-scrollable';
import { VirtualScroll } from './virtual-scroll';

export default defineComponent({
  name: 'virtual-scroll-tester',
  setup() {
    const arr: any[] = [];
    for (let i = 0; i < 1000000; i++) {
      arr.push({ name: 'test' + Math.random() });
    }

    const virtualScroll = new VirtualScrollable(arr);
    virtualScroll.defaultHeight = 40;

    return () => (
      <VirtualScroll style='height:200px'>
        {virtualScroll.dispalyItems.map((el, key) => (
          <div
            key={key}
            style={{
              backgroundColor: 'black',
              color: 'white',
              padding: '10px',
              // height: `${el._itemHeight || el._defaultHeight}px`,
            }}
          >
            {el.name}
          </div>
        ))}
      </VirtualScroll>
    );
  },
});
// import { VueWrapper, mount } from '@vue/test-utils';
// let compo: VueWrapper<any>;
// beforeEach(() => {
//   compo = mount(VirtualScrollTester);
// });
// describe('cdk-virtual-scroll', () => {
//   it('will mount successfully', () => {
//     expect(compo).toBeTruthy();
//   });
//   it('will never change the initialized template or css', () => {
//     expect(compo.html()).toBe(
//       '<div style=\"position: relative; overflow: auto; height: 200px;\"><!----><div style=\"height: 40000000px;\"></div><div style=\"position: absolute; width: 100%; z-index: 2; left: 0px; top: 0px;\"><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div></div></div>'
//     );
//   });
// });
