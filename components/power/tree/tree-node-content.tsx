import { Checkbox } from 'power-ui/checkbox';
import { defineComponent, reactive, toRef } from 'vue';
import { watchRef } from 'vue-cdk/hook';
import { List } from 'vue-cdk/utils';
import {CollapseTransition} from '../transition';

export const TreeNodeContent = defineComponent({
  props: {
    label: {
      type: String,
      default: ''
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    indent: {
      type: Number,
      default: 0,
    },
    iconClass: {
      type: String,
      default: ''
    },
    isLeaf: {
      type: Boolean,
      default: false
    },
    children: {
      type: List<JSX.Element>()
    },
    checked: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const nodeState = reactive({
      isCurrent: false,
      visible: false,
      disabled: false,
      loading: false,
    });

    const checked = watchRef(toRef(props, 'checked'), (value) => {
      ctx.emit('update:checked', value);
    });

    const expanded = watchRef(toRef(props, 'expanded'), (value) => {
      ctx.emit('update:expanded', value);
    });

    const handleExpanded = () => {
      expanded.value = !expanded.value;
    };

    return () => {
      const { iconClass, indent, showCheckbox, label, isLeaf, children } = props;
      return [
        <div
          class={['el-tree-node', {
            'is-expanded': expanded.value,
            'is-current': nodeState.isCurrent,
            'is-focusable': !nodeState.disabled,
            'is-checked': !nodeState.disabled && checked.value
          }]}
          onClick={handleExpanded}
          role="treeitem"
          tabindex={-1}
          aria-expanded={expanded.value}
          aria-disabled={nodeState.disabled}
          aria-checked={checked.value}
        >
          <div class="el-tree-node__content" style={{ paddingLeft: `${indent}px` }}>
            <span
              class={[
                {
                  'is-leaf': isLeaf,
                  expanded: !isLeaf && expanded.value
                },
                'el-tree-node__expand-icon',
                iconClass ? iconClass : 'el-icon-caret-right'
              ]}
            />
            {showCheckbox ? <Checkbox v-model={[checked.value, 'checked']} /> : undefined}
            {nodeState.loading ? <span class="el-tree-node__loading-icon el-icon-loading" /> : undefined}
            <span class="el-tree-node__label">{label}</span>
          </div>
        </div>,
        <CollapseTransition>
          <div v-show={expanded.value}>
            {children}
          </div>
        </CollapseTransition>
      ];
    };
  }
});
