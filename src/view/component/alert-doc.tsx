import { defineComponent } from 'vue';
import { Alert } from 'power-ui';

export default defineComponent(() => {
  return () => (
    <div>
      <p>
        <Alert
          v-slots={{ title: () => 'sdfsdfdsf' }}
          showIcon={true}
          type='error'
          onClose={() => {
          }}
        >
          this is test
        </Alert>
      </p>
      <p>
        <Alert
          title="kkkkkkk"
          showIcon={true}
          type='error'
          description="this is test"
        />
      </p>
    </div>
  );
});