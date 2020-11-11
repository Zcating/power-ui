import { defineComponent, inject, renderSlot } from "vue";
import VirtualScroll from "./virtualScroll";
import { reactToService } from "../tools";

export default defineComponent({
  name: "cdk-virtual-container",
  setup(_, ctx) {
    const virtualScroll = inject("cdk-virtual-scroll")! as VirtualScroll;
    const reactor = reactToService(virtualScroll.dirty);
    return () => (
      <div
        style='position: relative;overflow: auto;'
        ref={virtualScroll.containerRef}
      >
        {reactor.value}
        <div
          style={{
            height: virtualScroll.totalHeight + "px",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            width: "100%",
            zIndex: 2,
            left: 0,
            top: virtualScroll.beforeHeight + "px",
          }}
        >
          {renderSlot(ctx.slots, "default")}
        </div>
      </div>
    );
  },
});
