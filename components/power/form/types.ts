import { RuleItem } from 'async-validator';

export type LabelPosition = 'left' | 'right' | 'top';



interface TriggerRule {
  trigger?: 'blur' | 'change' | ('blur' | 'change')[]
}

export type FieldRules = RuleItem & TriggerRule;

export interface FormRules {
  [field: string]: (FieldRules) | (FieldRules)[];
}
