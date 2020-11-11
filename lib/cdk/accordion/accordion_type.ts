import { VNodeChild } from "vue";
import { CdkAny } from '../types';
import { AccordionDispatcher } from './accordion_dispatcher';

// accordion dispatcher wrapper
// when getting the slot props
// you will need it.
export interface AccordionSlotProps {
  dispatcher: AccordionDispatcher;
}


export interface AccordionItemSlotProps { 
  expanded: boolean;
}

// accordion item slot builder
export type AccordionItemSlotBuilder = (state: AccordionItemSlotProps) => VNodeChild | CdkAny


// accordion item builder
export type AccordionItemBuilder = (
  dispatcher: AccordionDispatcher,
) => VNodeChild | CdkAny;