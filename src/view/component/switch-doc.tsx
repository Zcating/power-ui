import { Switch } from '@/../lib';
import { defineComponent, shallowRef } from 'vue';

export const SwitchDoc = defineComponent({
  setup(_, ctx) {
    const city = shallowRef(['广州']);
    return () => (
      <div>
        <p>
          <Switch></Switch>
        </p>
      </div>
    );
  },
});