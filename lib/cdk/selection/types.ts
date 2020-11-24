import { VNode } from 'vue';

export interface SelectionItemState {
  selected: boolean;
}

// selection item slot builder
export type SelectionItemSlotBuilder = (state: SelectionItemState) => VNode | JSX.Element

export interface ItemData {
  label: string;
  value: string | number;
}

export type OptionItemData = ItemData | ItemData[] | null;

export type SelectionValue = number | string | (number | string)[]
