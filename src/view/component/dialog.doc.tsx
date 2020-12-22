import { defineComponent, ref } from 'vue';
import { Dialog, Button } from 'power-ui';

export default defineComponent(() => {
  const show = ref(false);
  return () => (
    <div>
      <p>
        <Button onClick={() => show.value = true}>show Dialog</Button>
        <Dialog
          title="提示"
          width="30%"
          v-model={[show.value, 'visible']}
          v-slots={{
            footer: () => (
              <span class="dialog-footer">
                <Button onClick={() => show.value = false}>取 消</Button>
                <Button type="primary" onClick={() => show.value = false}>确 定</Button>
              </span>
            ),
          }}
        >
          <div>测试内容</div>
        </Dialog>
      </p>
    </div>
  );
});
