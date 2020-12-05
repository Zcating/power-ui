import { Checkbox } from 'power-ui/checkbox';
import { defineComponent, reactive, shallowReactive, toRef } from 'vue';
import { watchRef } from 'vue-cdk/hook';
import { List } from 'vue-cdk/utils';

export const TreeNodeContent = defineComponent({
  props: {
    label: {
      type: String,
      default: ''
    },
    showCheckbox: {
      type: Boolean,
      default: true
    },
    indent: {
      type: Number,
      default: 0,
    },
    multipleExpand: {
      type: Boolean,
      default: false
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
  },
  setup(props, ctx) {
    const nodeState = reactive({
      expanded: false,
      isCurrent: false,
      visible: false,
      disabled: false,
      loading: false,
      expandedChildren: false,
    });

    const checked = watchRef(toRef(props, 'checked'), (value) => {
      ctx.emit('update:checked', value);
      console.log(value);
    });


    const handleExpanded = () => {
      nodeState.expanded = !nodeState.expanded;
    };

    return () => {
      const { iconClass, indent, showCheckbox, label, isLeaf } = props;
      return [
        <div
          class={['el-tree-node', {
            'is-expanded': nodeState.expanded,
            'is-current': nodeState.isCurrent,
            'is-hidden': !nodeState.visible,
            'is-focusable': !nodeState.disabled,
            'is-checked': !nodeState.disabled && checked.value
          }]}
          onClick={handleExpanded}
          role="treeitem"
          tabindex={-1}
          aria-expanded={nodeState.expanded}
          aria-disabled={nodeState.disabled}
          aria-checked={checked.value}
        >
          <div class="el-tree-node__content" style={{ paddingLeft: `${indent}px` }}>
            <span
              class={[
                {
                  'is-leaf': isLeaf,
                  expanded: !isLeaf && nodeState.expanded
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
        props.children
      ];
    };
  }
});
