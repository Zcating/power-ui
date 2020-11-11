import { mount, VueWrapper } from "@vue/test-utils";
import { defineComponent } from "vue";
import globalInit from "../global";
import VirtualScroll from "./virtualScroll";
import VirtualContainer from "./VirtualContainer";

const VirtualScrollTester = defineComponent({
  name: "virtual-scroll-tester",
  setup(_, ctx) {
    globalInit();
    const arr: any[] = [];
    for (let i = 0; i < 1000000; i++) {
      arr.push({ name: "test" });
    }
    const virtualScroll = new VirtualScroll(arr);
    virtualScroll.defaultHeight = 40;
    return () => (
      <VirtualContainer style='height:200px'>
        {virtualScroll.displayItems.map((el, key) => (
          <div
            key={key}
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "1em",
              height: el._itemHeight || el._defaultHeight,
            }}
          >
            {el.name}
          </div>
        ))}
      </VirtualContainer>
    );
  },
});

let compo: VueWrapper<any>;
beforeEach(() => {
  compo = mount(VirtualScrollTester);
});
describe("cdk-virtual-scroll", () => {
  it("will mount successfully", () => {
    expect(compo).toBeTruthy();
  });
  it("will never change the initialized template or css", () => {
    expect(compo.html()).toBe(
      `<div style=\"position: relative; overflow: auto; height: 200px;\"><!----><div style=\"height: 40000000px;\"></div><div style=\"position: absolute; width: 100%; z-index: 2; left: 0px; top: 0px;\"><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div><div style=\"background-color: black; color: white; padding: 1em;\">test</div></div></div>`
    );
  });
});
