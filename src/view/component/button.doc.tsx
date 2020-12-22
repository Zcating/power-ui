import { Button } from 'power-ui/button/button';
import { defineComponent } from 'vue';

export const ButtonDoc = defineComponent(() => {
  return () => (
    <div>
      <p>
        <Button>Click Me</Button>
      </p>
      <p>
        <Button type="default">test button</Button>
        <Button type="info">test button</Button>
        <Button type="primary">test button</Button>
        <Button type="success">test button</Button>
        <Button type="warning">test button</Button>
        <Button type="text">test button</Button>
        <Button type="danger">test button</Button>
      </p>
    </div>
  );
});