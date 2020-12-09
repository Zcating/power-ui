import { DefineComponent, defineComponent, resolveComponent } from 'vue';


export const PowerModule = defineComponent({
  setup(_, ctx) {
    const Message = resolveComponent('po-message') as DefineComponent;
    const Notification = resolveComponent('po-notification') as DefineComponent;
    return () => (
      <>
        {ctx.slots.default?.()}
        {Message ? <Message /> : null}
        {Notification ? <Notification /> : null}
      </>
    );
  }
});
