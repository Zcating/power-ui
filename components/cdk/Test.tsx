import { defineComponent } from 'vue';
import BIDI from './global/bidirection.spec';
import BP from './global/breakpoint.spec';
import PLAT from './global/platform.spec';
import CB from './global/clipboard.spec';
import SB from './scrolling/scrollable.spec';
import SELECTION from './selection/selection.spec';
import ACCORDION from './accordion/accordion.spec';
import TR from './tree/TreeNode.spec';
import VS from './scrolling/virtual-scroll.spec';
// import OVERLAY from './overlay/overlay.spec';

export default defineComponent({
  name: 'cdk-test',
  setup() {
    return () => (
      <>
        <h2>bidirection</h2>
        <BIDI />
        <h2>breakpoint</h2>
        <BP />
        <h2>platform</h2>
        <PLAT />
        <h2>clipboard</h2>
        <CB />
        <h2>scrollable</h2>
        <SB />
        <h2>accordion</h2>
        <SELECTION />
        <h2>tree</h2>
        <TR />
        <h2>virtual scroll</h2>
        <VS />
        <h2> accordion</h2>
        <ACCORDION />
      </>
    );
  },
});
