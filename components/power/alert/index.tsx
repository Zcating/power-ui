import { ElEffect } from 'power-ui/types';
import { Transition, computed, defineComponent, ref } from 'vue';
import { Enum, renderCondition } from 'vue-cdk/utils';

export default defineComponent({
  name: 'po-alert',
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: Enum<'info' | 'success' | 'warning' | 'error'>(),
      default: 'info',
    },
    closable: {
      type: Boolean,
      default: true,
    },
    closeText: {
      type: String,
      default: '',
    },
    showIcon: Boolean,
    center: Boolean,
    effect: {
      type: Enum<ElEffect>(),
      default: 'light',
    },
    onClose: {
      type: Function,
      default: () => { },
    },
  },
  setup(props, ctx) {
    const visible = ref(true);
    const close = () => {
      visible.value = false;
      props.onClose();
    };
    const isBigIcon = computed(() => (props.description || ctx.slots.default) ? 'is-big' : '');
    const isBoldTitle = computed(() => (props.description || ctx.slots.default) ? 'is-bold' : '');

    return () => (
      <Transition name='el-alert-fade' appear={true}>
        <div
          class={[
            'el-alert',
            'el-alert--' + props.type,
            props.center ? 'is-center' : '',
            'is-' + props.effect,
          ]}
          v-show={visible.value}
          role='alert'
        >
          {renderCondition(
            props.showIcon,
            <i
              class={[
                'el-alert__icon',
                'el-icon-' + props.type,
                isBigIcon.value,
              ]}
            />
          )}

          <div class='el-alert__content'>
            {renderCondition(
              ctx.slots.title || props.title,
              (value) => (
                <span class={['el-alert__title', isBoldTitle.value]}>
                  {typeof value === 'function' ? value() : value}
                </span>
              )
            )}
            {renderCondition(
              ctx.slots.default || props.description,
              (value) => (
                <p class='el-alert__description'>
                  {typeof value === 'function' ? value() : value}
                </p>
              )
            )}
            <i
              class={{
                'el-alert__closebtn': true,
                'is-customed': props.closeText !== '',
                'el-icon-close': props.closeText === '',
              }}
              v-show={props.closable}
              onClick={close}
            >
              {props.closeText}
            </i>
          </div>
        </div>
      </Transition>
    );
  },
});
