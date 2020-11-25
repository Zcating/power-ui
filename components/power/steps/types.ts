import { CSSProperties } from 'vue';

export type ElStepDirection = 'vertical' | 'horizontal';

export type ElStepStatus = 'wait' | 'process' | 'finish' | 'error' | 'success';


export interface ElStepProps {
  space?: number | string;
  active: number;
  direction: ElStepDirection;
  alignCenter?: boolean;
  simple?: boolean;
  finishStatus: string,
  processStatus: string
}


export interface ElStepsData {
  space: number | string;
  active: number;
  isCenter: boolean;
  isVertical: boolean;
  simple: boolean;
  finishStatus: ElStepStatus;
  processStatus: ElStepStatus;
  stepOffset: number;
  direction: string;
  steps: ElStepData[];
}

export interface ElStepData {
  index: number;
  currentStatus: ElStepStatus;
  prevStatus: ElStepStatus;
  lineStyle: CSSProperties;
}
