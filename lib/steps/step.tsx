import { Enum, renderCondition } from '../cdk/utils';
import { computed, defineComponent, onUnmounted, reactive, ref, renderSlot, toRefs, watch } from 'vue';
import { injectService } from './step.service';
import { ElStepData, ElStepStatus } from './types';


export const Step = defineComponent({
  props: {
    title: String,
    icon: String,
    description: String,
    status: Enum<ElStepStatus>()
  },
  setup(props) {
    const service = injectService();

    const data = reactive<ElStepData>({
      index: 0,
      currentStatus: props.status || 'process',
      prevStatus: 'process',
      lineStyle: {},
    });

    if (!service) {
      return { data };
    }

    service.control(data);
    const serviceState = service.stateRefs();
    const style = service.style(data);
    const isLast = service.testLast(data);

    return {
      isSimple: serviceState.simple,
      isCenter: serviceState.isCenter,
      isVertical: serviceState.isVertical,
      space: serviceState.space,
      stepOffset: serviceState.stepOffset,
      direction: serviceState.direction,
      style,
      isLast,
      data
    }
  },

  render() {
    const {
      style,
      isSimple,
      isLast,
      isCenter,
      isVertical,
      space,
      stepOffset,
      direction,
      icon,
      description,
      $slots,
      title,
      data: {
        index,
        currentStatus,
        lineStyle,
      },
    } = this;

    const currentStatusClass = `is-${currentStatus}`;
    const mainIconClass = `el-icon-${currentStatus === 'success' ? 'check' : 'close'}`;
    
    return <div
      style={style}
      class={[
        "el-step",
        !isSimple && `is-${direction}`,
        isSimple && 'is-simple',
        isLast && !space && !isCenter && 'is-flex',
        isCenter && !isVertical && !isSimple && 'is-center'
      ]}>
      {/* <!-- icon & line --> */}
      <div class={["el-step__head", currentStatusClass]}>
        <div
          class="el-step__line"
          style={isLast ? '' : { marginRight: stepOffset + 'px' }}
        >
          <i class="el-step__line-inner" style={lineStyle} />
        </div>

        <div class={['el-step__icon', `is-${icon ? 'icon' : 'text'}`]}>
          {renderCondition(
            currentStatus !== 'success' && currentStatus !== 'error',
            [
              renderSlot($slots, 'default'),
              renderCondition(icon, <i class={['el-step__icon-inner', icon]} />),
              renderCondition(!icon && !isSimple, <div class="el-step__icon-inner">{index + 1}</div>)
            ],
            <i class={[
              'el-step__icon-inner',
              'is-status',
              mainIconClass
            ]} />
          )}
        </div>
      </div >
      {/* < !--title & description-- > */}
      <div class="el-step__main">
        <div ref="title" class={['el-step__title', currentStatusClass]}>
          {renderSlot($slots, 'title')}
          {title}
        </div>
        {renderCondition(
          isSimple,
          <div class="el-step__arrow" />,
          <div class={['el-step__description', currentStatusClass]}>
            {renderSlot($slots, 'description')}
            {description}
          </div>
        )}
      </div>
    </div>;
  }
});


export type StepComponent = InstanceType<typeof Step>;
