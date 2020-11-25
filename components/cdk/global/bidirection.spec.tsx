import { defineComponent } from 'vue';
import { useBidirection } from '.';

export default defineComponent({
  name: 'bidirection-spec',
  setup() {
    const bidi = useBidirection();
    return () => (
      <div>
        <button
          onClick={() => {
            bidi.direction.value =
              bidi.direction.value === 'ltr'
                ? (bidi.direction.value = 'rtl')
                : (bidi.direction.value = 'ltr');
          }}
        >
          change direction
        </button>
        <p>lorum ipsum ...</p>
      </div>
    );
  },
});
