import { computed, defineComponent, inject } from 'vue';
import { MessageItem } from './message-item';
import { Overlay } from 'vue-cdk/overlay';
import { $messageImpl } from './message.service';

/**
 * @component Message
 * 
 * @description 
 * TODO: add description
 */
export const Message = defineComponent({
  name: 'po-message',
  setup() {
    const service = inject($messageImpl)!;
    const visible = computed(() => {
      return service.datas.length > 0;
    });

    return () => (
      <Overlay
        visible={visible.value}
        hasBackdrop={false}
      >
        <div class="el-message-container">
          {service.datas.map((value) => (
            <MessageItem
              key={value.messageId}
              id={value.messageId}
              type={value.type}
              iconClass={value.iconClass}
              content={value.content}
              onDestroy={service.destroy}
            />
          ))}
        </div>
      </Overlay>
    );
  }
});
