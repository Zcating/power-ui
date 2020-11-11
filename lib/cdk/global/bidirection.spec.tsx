import { defineComponent, inject } from "vue";
import { bidirectionToken } from ".";

export default defineComponent({
  name: "bidirection-spec",
  setup() {
    const bidi = inject(bidirectionToken)!;
    return () => (
      <div>
        <button
          onClick={() => {
            bidi.direction.value =
              bidi.direction.value === "ltr"
                ? (bidi.direction.value = "rtl")
                : (bidi.direction.value = "ltr");
          }}
        >
          change direction
        </button>
        <p>lorum ipsum ...</p>
      </div>
    );
  },
});
