import { defineComponent, reactive, shallowRef, watch } from 'vue';
import { Form, FormItem, FormRules, Input, RadioGroup, Radio, Select, SelectOption, Rate } from 'power-ui';

export default defineComponent(() => {
  const data = reactive({
    name: '',
    age: '',
    city: '',
    rate: undefined
  });
  const rules = shallowRef<FormRules>({
    name: [
      { type: 'string', required: true, message: 'please input name', trigger: 'change' },
    ],
    age: [
      { type: 'string', required: true, message: 'please input age', trigger: 'blur' },
    ],
    rate: [
      { type: 'number', required: true, message: 'rate must selected', trigger: ['blur'] }
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
            <Select v-model={data.age} clearable={true}>
              <SelectOption value="1" label="test1" />
              <SelectOption value="2" label="test2" />
              <SelectOption value="3" label="test3" />
              <SelectOption value="4" label="test4" />
              <SelectOption value="5" label="test5" />
            </Select>
          </FormItem>
          <FormItem width="100px" label="评级" name="rate">
            <Rate v-model={data.rate} />
          </FormItem>
          <FormItem width="100px" label="城市" name="city">
            <RadioGroup v-model={data.city} >
              <Radio value="北京" />
              <Radio value="上海" />
              <Radio value="广州" />
              <Radio value="深圳" />
              <Radio value="珠海" />
            </RadioGroup>
          </FormItem>
        </Form>
      </div>
    );
  };
});