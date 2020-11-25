import { computed, defineComponent, inject, shallowRef } from 'vue';
import { langToken } from 'vue-cdk/global';
import { zhCN } from 'vue-cdk/lang';
import { chunk } from 'lodash-es';
import { month } from 'vue-cdk';
import { Method, Model } from 'vue-cdk/utils';
import { Renderable } from 'vue-cdk/types';

export default defineComponent({
  name: 'ele-calendar',
  props: {
    modelValue: {
      type: [String, Number, Model<Date>()],
      default: () => new Date(),
    },
    renderCell: {
      type: Method<(time: Date) => Renderable>(),
      default: (t: Date) => t.getDate(),
    }
  },
  setup(props, ctx) {
    const weekList = inject(langToken, shallowRef(zhCN)).value.datepicker.weeks;
    const dayList = computed(() => {
      let time: Date;
      if (props.modelValue instanceof Date) {
        time = props.modelValue;
      } else if (typeof props.modelValue === 'string' || typeof props.modelValue === 'number') {
        const newTime = new Date(props.modelValue);
        // 'isNaN' can check if time is vaild.
        if (newTime && !isNaN(newTime as any)) {
          time = newTime;
        } else {
          time = new Date();
        }
      } else {
        time = new Date();
      }

      return chunk(month(time), 7);
    });
    return () => (
      <table cellspacing='0' cellpadding='0' class='el-calendar-table'>
        <thead>
          <tr>
            {Object.keys(weekList).map((idx) => (
              <th key={idx}>{(weekList as any)[idx]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dayList.value.map((row, idx) => (
            <tr class='el-calendar-table__row' key={idx}>
              {row.map((col, idx2) => (
                <td class={col.type} key={idx2}>
                  <div class='el-calendar-day' onClick={() => {
                    ctx.emit('update:modelValue', col.time);
                  }}>
                    {ctx.slots.cell ? ctx.slots.cell({ time: col.time }) : props.renderCell(col.time)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
});
