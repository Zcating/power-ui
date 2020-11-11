import { computed, defineComponent, inject, ref } from "vue";
import { langToken } from "../cdk/global";
import zhCN from "../cdk/lang/zh-CN";
import { chunk } from "lodash-es";
import { month } from "../cdk";
export default defineComponent({
  name: "ele-calendar",
  props: {
    time: {
      type: [String, Date, Number],
      default: () => {
        return new Date();
      },
    },
    renderCell: {
      type: Function,
      default: (t: Date) => t.getDate(),
    },
  },
  setup(props, ctx) {
    const weekList = inject(langToken, ref(zhCN)).value.datepicker.weeks;
    const dayList = computed(() => {
      let time = new Date();
      if (typeof props.time === "string" || typeof props.time === "number") {
        const newTime = new Date(props.time);
        if (newTime && !isNaN(newTime as any)) {
          time = newTime;
        }
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
                  <div class='el-calendar-day'>
                    {props.renderCell(col.time)}
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
