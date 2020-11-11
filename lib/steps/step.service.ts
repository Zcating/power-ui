import { coerceCssPixelValue } from '../cdk/coercion';
import { computed, CSSProperties, inject, InjectionKey, onUnmounted, provide, reactive, toRef, toRefs, watch } from 'vue';
import { ElStepProps, ElStepsData, ElStepData } from './types';


const stepServiceKey = Symbol() as InjectionKey<StepService>;

export const injectService = () => inject(stepServiceKey);

export class StepService {

  private state: ElStepsData;


  constructor(props: ElStepProps) {
    provide(stepServiceKey, this);

    this.state = reactive({
      active: toRef(props, 'active'),
      isCenter: computed<boolean>(() => !!props.alignCenter),
      isVertical: computed(() => props.direction === 'vertical'),
      space: computed(() => props.simple ? '' : props.space),
      simple: toRef(props, 'simple'),
      finishStatus: toRef(props, 'finishStatus'),
      processStatus: toRef(props, 'processStatus'),
      direction: toRef(props, 'direction'),
      steps: [],
      stepOffset: 0,
    }) as ElStepsData;

    watch(
      () => this.state.steps,
      values => values.forEach((data, index) => {
        data.index = index;
      }),
      { immediate: true }
    );
  }

  // provide reactive
  stateRefs() {
    return toRefs(this.state);
  }

  style(data: ElStepData) {
    return computed(() => {
      const style: CSSProperties = {};
      const {
        space,
        isVertical,
        isCenter,
        steps: { length: count },
        stepOffset
      } = this.state;

      style.flexBasis = coerceCssPixelValue(space) || `${100 / (count - (isCenter ? 0 : 1))}%`;

      if (isVertical) {
        return style;
      }
      if (this.isLast(data)) {
        style.maxWidth = `${100 / count}%`;
      } else {
        style.marginRight = `${- stepOffset}px`;
      }
      return style;
    });
  }

  control(data: ElStepData) {
    const state = this.state;
    const steps = state.steps;
    state.steps = [...steps, data];

    // 
    watch(() => [state.active, state.processStatus], (values) => {
      this.updateStatus(values[0] as number, data);
    }, { immediate: true });

    // delete when unmounted
    onUnmounted(() => {
      state.steps = steps.filter(step => step.index === data.index);
    });
  }

  testLast(data: ElStepData) {
    return computed(() => this.isLast(data));
  }
  

  private isLast(data: ElStepData) {
    const steps = this.state.steps;
    return steps[steps.length - 1] === data;
  }

  private updateStatus(index: number, data: ElStepData) {
    const { steps, finishStatus, processStatus } = this.state;
    const prevData = steps[data.index - 1];

    if (index > data.index) {
      data.currentStatus = finishStatus;
    } else if (index === data.index && data.prevStatus !== 'error') {
      data.currentStatus = processStatus;
    } else {
      data.currentStatus = 'wait';
    }

    if (prevData) {
      this.calcProgress(prevData, data.currentStatus);
    }
  }

  private calcProgress(data: ElStepData, status: string) {
    const { processStatus, isVertical, simple } = this.state;

    let step = 100;
    const style: CSSProperties = {};

    style.transitionDelay = 150 * data.index + 'ms';
    if (status === processStatus) {
      step = data.currentStatus !== 'error' ? 0 : 0;
    } else if (status === 'wait') {
      step = 0;
      style.transitionDelay = (-150 * data.index) + 'ms';
    }

    style.borderWidth = step && !simple ? '1px' : 0;

    if (isVertical) {
      style.height = step + '%';
    } else {
      style.width = step + '%';
    }
    data.lineStyle = style;
  }
}