import { defineComponent, reactive, ref, toRaw } from "vue";
import Scrollable, { ScrollToOptions } from "./scrollable";
import "./scrollable.spec.css";

export default defineComponent({
  name: "scrollable-spec",
  setup() {
    const scrollable = new Scrollable();
    const options: ScrollToOptions = reactive({
      left: 0,
      top: 0,
    });
    const otherOptions: ScrollToOptions = reactive({
      right: 0,
      bottom: 0,
    });
    const targetRef = ref<HTMLElement | null>(null);
    return () => (
      <>
        <div class='scrollable-spec-container' ref={scrollable.nodeRef}>
          <p>scrollTo scrollTo scrollTo</p>
          <p>scrollTo scrollTo scrollTo</p>
          <p>scrollTo scrollTo scrollTo</p>
          <p>scrollTo scrollTo scrollTo</p>
          <p style='color:red' ref={targetRef}>
            target
          </p>
          <p>scrollTo scrollTo scrollTo</p>
          <p>scrollTo scrollTo scrollTo</p>
          <p>scrollTo scrollTo scrollTo</p>
          <p>scrollTo scrollTo scrollTo</p>
          <p>scrollTo scrollTo scrollTo</p>
        </div>
        left:
        <input v-model={options.left} />
        top:
        <input v-model={options.top} />
        <button
          onClick={() => {
            const result = toRaw(options);
            for (let key of Object.keys(result)) {
              if (typeof (result as any)[key] === "string") {
                (result as any)[key] = parseInt((result as any)[key]);
              }
            }
            scrollable.scrollTo(result);
          }}
        >
          scroll to
        </button>
        right:
        <input v-model={otherOptions.right} />
        bottom:
        <input v-model={otherOptions.bottom} />
        <button
          onClick={() => {
            const result = toRaw(otherOptions);
            for (let key of Object.keys(result)) {
              if (typeof (result as any)[key] === "string") {
                (result as any)[key] = parseInt((result as any)[key]);
              }
            }
            scrollable.scrollTo(result);
          }}
        >
          scroll to
        </button>
        <button
          onClick={() => {
            console.log(scrollable.nodeRef.value?.scrollTop);
            scrollable.scrollToElement(targetRef);
          }}
        >
          scroll to target
        </button>
      </>
    );
  },
});
