import { Radio, RadioGroup } from 'power-ui/index';
import { defineComponent, reactive } from 'vue';

export const RadioDoc = defineComponent({
  setup() {
    const state = reactive({
      value: '1',
      boolValue: false,
    });
    return () => (
      <div>
        <p>
          <Radio v-model={state.boolValue} value="1">test1</Radio>
          <Radio v-model={state.boolValue} value="2">test2</Radio>
        </p>
        <p>
          <RadioGroup v-model={state.value}>
            <Radio value="1">test1</Radio>
            <Radio value="2">test2</Radio>
            <Radio value="3">test2</Radio>
            <Radio value="4">test2</Radio>
          </RadioGroup>
        </p>
      </div>
    );
  }
});
