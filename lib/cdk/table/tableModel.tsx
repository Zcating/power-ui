import { Component, defineComponent, provide, Ref } from "vue";
import { markDirty } from "../tools";

type TdRender<T> = (item: T, index: number) => JSX.Element;

export interface TableColumn<T> {
  dataIndex?: string;
  header: string | JSX.Element;
  content: TdRender<T> | string;
  selected?: boolean;
  hidden?: boolean;
  order?: number;
}

/**
 * use like
 * <table>
 *    <tr>{tableModel.columns.map(el=>(<th>el.header</th>))}</tr>
 *    {tableModel.dataSource.map((el,key)=><tr>
 *       {tableModel.displayColumns.map(item=>
 *         <td>{item.dataIndex?item.content:item.content(el,key))}</td>
 *       }
 *    </tr>)}
 * </table>
 *
 * @export
 * @class
 * @template T
 */
export default class<T extends { [key: string]: any }> {
  dataSource: T[] = [];
  columns: TableColumn<T>[] = [];
  // operated
  displayColumns: TableColumn<T>[] = [];

  // reactive
  mark: () => void;
  dirty: Ref<null | undefined>;

  // change order
  currentOrderKey: string = "id";
  changeOrder = (key: string, desc = true) => {
    this.displayColumns.sort((pre: any, next: any) => {
      if (pre[key] > next[key]) {
        return desc ? -1 : 1;
      } else if (pre[key] == next[key]) {
        return 0;
      } else if (pre[key] < next[key]) {
        return desc ? 1 : -1;
      }
      return 0;
    });
    this.currentOrderKey = key;
    this.mark();
  };

  /**
   * hide/show column
   *
   */
  toggleSomeContent = (dataIndexs: string[], show = true) => {
    for (let item of this.columns) {
      if (dataIndexs.includes(item.dataIndex || "")) {
        item.hidden = show;
      }
    }
    this.displayColumns = this.columns.filter((el) => !el.hidden);
    this.mark();
  };

  constructor(dataSource: T[], columns: TableColumn<T>[]) {
    const { dirty, mark } = markDirty();
    this.dirty = dirty;
    this.mark = mark;
    this.dataSource = dataSource;
    this.columns = columns;
    this.displayColumns = this.columns.filter((el) => !el.hidden);
    this.mark();
    provide("cdk-table", this);
  }
}
