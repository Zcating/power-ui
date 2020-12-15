import { VNode } from 'vue';

export interface SelectionItemState {
  selected: boolean;
}

// selection item slot builder
export type SelectionItemSlotBuilder = (state: SelectionItemState) => VNode | JSX.Element

export type SelectionValue = number | string | (number | string)[]
