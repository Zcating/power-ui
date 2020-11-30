import { defineComponent, reactive, ref, shallowRef } from 'vue';
import { Form, FormItem, Input } from 'power-ui';

export default defineComponent(() => {
  const data = reactive({
    name: '',
    age: ''
  });
  return () => {
    const state = shallowRef({ state: 'fuck' });
    return (
      <div>
        <Form rules={state}>
          <FormItem label="名称" name="name">
            <Input v-model={data.name} />
          </FormItem>
          <FormItem label="年龄" name="age">
            <Input v-model={data.age} />
          </FormItem>
        </Form>
      </div>
    );
  };
});