import VirtualScroll from "../scrolling/virtualScroll";
import { defineComponent } from "vue";
import { clone } from "lodash-es";
import VirtualContainer from "../scrolling/VirtualContainer";

export default defineComponent({
  name: "cdk-table-virtual-spect",
  setup() {
    const headers = ["test", "test1", "test2"];
    const dataSource = [
      { test: "test", test1: "test1", test2: "test2" },
      { test: "testtt", test1: "testtt1", test2: "testtt2" },
    ];
    for (let i = 0; i < 1000; i++) {
      dataSource.push(
        clone({ test: "testtt", test1: "testtt1", test2: "testtt2" })
      );
    }
    const virtualScroll = new VirtualScroll(dataSource);
    return () => (
      <VirtualContainer style='height:200px;overflow:auto;position:relative'>
        <table style='table-layout:fixed;width:100%'>
          <caption>test table</caption>
          <thead style='position:sticky'>
            <tr>
              {headers.map((el) => (
                <th key={el}>{el}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {virtualScroll.displayItems.map((el, index) => (
              <tr
                key={index}
                style={{
                  height:
                    el.virtualHeight || virtualScroll.defaultHeight + "px",
                }}
              >
                {headers.map((title) => (
                  <td key={title}>{(el as any)[title]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <tfoot style='width:100%'></tfoot>
      </VirtualContainer>
    );
  },
});
