import { defineComponent, renderSlot } from 'vue';
import { globalInject } from 'vue-cdk/global';
import { provideMessage } from './message';
import { provideNotification } from './notification';


export const PowerViewProvider = defineComponent({
  setup(_, ctx) {
    globalInject();
    const messageService = provideMessage();
    const notificationService = provideNotification();
    return () => (
      <>
        {renderSlot(ctx.slots, 'default')}
        <messageService.container />
        <notificationService.container />
      </>
    );
  }
});
