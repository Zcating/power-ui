import { RuleItem } from 'async-validator';

export type LabelPosition = 'left' | 'right' | 'top';



interface TriggerRule {
  trigger?: 'blur' | 'change' | ('blur' | 'change')[]
}

export interface FormRules {
  [field: string]: (RuleItem & TriggerRule) | (RuleItem & TriggerRule)[];
}
