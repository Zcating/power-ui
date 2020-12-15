import { defineComponent } from 'vue';
import { useBidirection } from './index';

export default defineComponent({
  name: 'bidirection-spec',
  setup() {
    const bidi = useBidirection();
    return () => (
      <div>
        <button
          onClick={() => {
            bidi.direction =
              bidi.direction === 'ltr'
                ? (bidi.direction = 'rtl')
                : (bidi.direction = 'ltr');
          }}
        >
          change direction
        </button>
        <p>lorum ipsum ...</p>
      </div>
    );
  },
});
