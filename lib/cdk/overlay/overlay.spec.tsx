import { mount, VueWrapper } from "@vue/test-utils";
import { defineComponent, ref, inject} from "vue";
const OverlayTester = defineComponent({
  // name: 'overlay-spec',
  // setup(_, ctx) {
  //   const service = inject(overlayToken)!;
  //   const target = ref<Element>();

  //   const globalOverlayState = service.create({ 
  //     strategy: service.createPositionStrategy('global').centerHorizontally().centerVertically() 
  //   });
  //   const GlobalOverlay = globalOverlayState.element;

  //   const click = () => {
  //     globalOverlayState.attach();
  //   }

  //   const flexibleOverlayState2 = service.create({
  //     strategy: service.createPositionStrategy('flexible', target),
  //   });
  //   const FlexibleOverlay = flexibleOverlayState2.element;

  //   const clickFlexiblePosition2 = () => {
  //     flexibleOverlayState2.attach();
  //   };


  //   return () => (
  //     <>
  //       <button onClick={click} style="display: block;" class="">click me</button>
  //       <div style="position:absolute; top:300px; left:300px; height:150vh;">
  //         <button
  //           ref={target}
  //           onClick={clickFlexiblePosition2}
  //           style="display: block; position: absolute; top: 300px; left: 300px; width: 200px;"
  //         >click flexible position</button>
  //       </div>
  //       <GlobalOverlay>
  //         <div>'this is test'</div>
  //       </GlobalOverlay>
  //       <FlexibleOverlay>
  //         <div style="background: red; position: absolute;height: 100px; width:100px;">'this is flexible test'</div>
  //       </FlexibleOverlay>
  //     </>
  //   );
  // }
});

export default OverlayTester;

let compo: VueWrapper<any>;
beforeEach(() => {
  compo = mount(OverlayTester);
});
describe("cdk-virtual-scroll", () => {
  it("will mount successfully", () => {
    expect(compo).toBeTruthy();
  });
});
