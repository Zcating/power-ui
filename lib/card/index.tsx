import { Model, renderCondition } from '../cdk/utils';
import { CSSProperties, defineComponent, renderSlot } from 'vue'

export const Card = defineComponent({
  props: {
    bodyStyle: {
      type: [String, Model<CSSProperties>()],
      default: '',
    },
    shadow: {
      type: String,
      default: ''
    }
  },

  render() {
    const { bodyStyle, shadow, $slots } = this;
    return (
      <div class={['el-card', shadow ? 'is-' + shadow + '-shadow' : 'is-always-shadow']}>
        {renderCondition(
          $slots.header,
          <div class="el-card__header">
            {renderSlot($slots, 'header')}
          </div>
        )}
        <div class="el-card__body" style={bodyStyle}>
          {renderSlot($slots, 'default')}
        </div>
      </div>
    );
  }
});
