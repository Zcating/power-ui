import { Switch } from 'power-ui';
import { defineComponent, shallowRef } from 'vue';

export const SwitchDoc = defineComponent(() => {
  const switchValue = shallowRef(false);
  return () => (
    <div>
      <p>
        <Switch
          v-model={switchValue.value}
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </p>
    </div>
  );
});
