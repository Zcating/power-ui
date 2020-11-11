import { defineComponent, DefineComponent, reactive } from "vue";
import { CdkAccordionContainer } from './accordion_container';
import { CdkAccordionItem } from './accordion_item';
import { AccordionDispatcher } from './accordion_dispatcher';
import { AccordionItemSlotBuilder, AccordionItemSlotProps, AccordionSlotProps } from './accordion_type';

export class CdkAccordion {
  private readonly state = reactive({
    multi: false,
    expanded: false
  });

  public readonly element: DefineComponent;

  constructor(builders: AccordionItemSlotBuilder[]) {
    this.element = this.render(builders);
  }

  get expanded() {
    return this.state.expanded;
  }

  get multi() {
    return this.state.multi;
  }

  set multi(value: boolean) {
    this.state.multi = value;
  }

  openAll() {
    this.state.expanded = true;
  }

  closeAll() {
    this.state.expanded = false;
  }

  private accordionItem(
    builder: AccordionItemSlotBuilder,
  ) {
    const slots = {
      default: (state: AccordionItemSlotProps) => builder(state),
    };
    return (
      <CdkAccordionItem v-slots={slots}></CdkAccordionItem>
    );
  }

  private render(builders: AccordionItemSlotBuilder[]) {
    return defineComponent(() => {
      return () => (
        <CdkAccordionContainer expanded={this.state.expanded} multi={this.state.multi}>
          {builders.map((builder) => this.accordionItem(builder))}
        </CdkAccordionContainer>
      );
    });
  }
}