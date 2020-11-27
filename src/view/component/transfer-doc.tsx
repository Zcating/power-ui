import { defineComponent } from 'vue';
import { Transfer } from 'power-ui';
import { range } from 'lodash-es';

export default defineComponent(() => {
  const data = range(0, 15, 1).map((i) => ({
    key: `key${i}`,
    label: `备选项 ${i}`,
    disabled: i % 4 === 0
  }));
  console.log(data);
  return () => (
    <div>
      <Transfer dataSource={data}></Transfer>
    </div>
  );
});
