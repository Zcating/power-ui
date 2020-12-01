import { defineComponent, reactive, shallowRef } from 'vue';
import { Form, FormItem, FormRules, Input, Select, SelectOption } from 'power-ui';

export default defineComponent(() => {
  const data = reactive({
    name: '',
    age: ''
  });
  const rules = shallowRef<FormRules>({
    name: [
      { type: 'string', required: true, message: 'please input name', trigger: 'blur' },
    ],
    age: [
      { type: 'string', required: true, message: 'please input age', trigger: 'blur' },
    ]
  });
  return () => {
    return (
      <div>
        <Form model={data} rules={rules.value}>
          <FormItem width="100px" label="名称" name="name">
            <Input v-model={data.name} />
          </FormItem>
          <FormItem width="100px" label="年龄" name="age">
            <Select v-model={data.age}>
              <SelectOption value="1" label="test1" />
              <SelectOption value="2" label="test2" />
              <SelectOption value="3" label="test3" />
              <SelectOption value="4" label="test4" />
              <SelectOption value="5" label="test5" />
            </Select>
          </FormItem>
        </Form>
      </div>
    );
  };
});