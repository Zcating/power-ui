import { computed, defineComponent } from 'vue';
import { chunk } from 'lodash-es';
import { daysRange, typeMonth } from 'vue-cdk';
import { Method, Model } from 'vue-cdk/utils';
import { Renderable } from 'vue-cdk/types';
import { zhCN, LangConfig } from 'power-ui/lang';
import { ButtonGroup } from 'power-ui/button';
import { Button } from 'power-ui/button/button';
import { watchRef } from 'vue-cdk/hook';


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
    const lang = zhCN as unknown as LangConfig;
    const weekList = lang.datepicker.weeks;
    const dateRef = watchRef(
      computed(() => {
        let time: Date;
        const { modelValue } = props;
        if (modelValue instanceof Date) {
          time = modelValue;
        } else if (typeof modelValue === 'string' || typeof modelValue === 'number') {
          const newTime = new Date(modelValue);
          // 'isNaN' can check if time is vaild.
          if (newTime && !isNaN(newTime as any)) {
            time = newTime;
          } else {
            time = new Date();
          }
        } else {
          time = new Date();
        }
        return time;
      }),
      (value) => ctx.emit('update:modelValue', value),
    );



    const dayList = computed(() => {
      return chunk(daysRange(dateRef.value), 7);
    });

    const title = computed(() => {
      const date = dateRef.value;
      return `${date.getFullYear()} ${lang.datepicker.year} ${lang.datepicker[`month${date.getMonth() + 1}`]}`;
    });

    const isCurrentDay = (date: Date) => {
      return dateRef.value.getMonth() === date.getMonth() &&
        dateRef.value.getDate() === date.getDate();
    };

    const clickMonth = (type: 'prev' | 'current' | 'next', initDate?: Date) => {
      const date = initDate ?? typeMonth(type, dateRef.value);
      dateRef.value = date;
    };

    return () => (
      <div class="el-calendar">
        <div class="el-calendar__header">
          <div class="el-calendar__title">
            {title.value}
          </div>
          <div class="el-calendar__button-group">
            <ButtonGroup>
              <Button size="mini" onClick={() => clickMonth('prev')}>{lang.datepicker.prevMonth}</Button>
              <Button size="mini" onClick={() => clickMonth('current')}>{lang.datepicker.today}</Button>
              <Button size="mini" onClick={() => clickMonth('next')}>{lang.datepicker.nextMonth}</Button>
            </ButtonGroup>
          </div>
        </div>
        <div class="el-calendar__body">
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
                    <td class={[col.type, isCurrentDay(col.time) ? 'is-selected' : '']} key={idx2}>
                      <div class='el-calendar-day' onClick={() => clickMonth(col.type, col.time)}>
                        {ctx.slots.cell ? ctx.slots.cell({ time: col.time }) : props.renderCell(col.time)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});
