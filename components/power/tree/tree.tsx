import { computed, defineComponent, reactive, toRef } from 'vue';
import { List } from 'vue-cdk/utils';
import { CdkTree, TreeNodeSlotData } from 'vue-cdk/tree';
import Content from './content';
import { watchRef } from 'vue-cdk/hook';


export interface TreeNodeData<T = any> {
  key: string | number;
  label: string;
  value?: T;
  children?: TreeNodeData<T>[];
}

export const Tree = defineComponent({
  name: 'po-tree',
  props: {
    dataSource: {
      type: List<TreeNodeData>(),
      default: [],
    },
    emptyText: {
      type: String,
      default: '',
    },
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    checkDescendants: {
      type: Boolean,
      default: false
    },
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: false
    },
    indent: {
      type: Number,
      default: 18
    },
    checkedKeys: {
      type: List<string | number>(),
      default: []
    },
    defaultCheckedKeys: List<string | number>(),
    defaultExpandedKeys: List<string | number>(),
    currentNodeKey: [String, Number],
    checkOnClickNode: Boolean,
    renderContent: Function,
    allowDrag: Function,
    allowDrop: Function,
    nodeKey: String,
    checkStrictly: Boolean,
    defaultExpandAll: Boolean,
    highlightCurrent: Boolean,
    load: Function,
    filterNodeMethod: Function,
    accordion: Boolean,
    iconClass: String
  },
  setup(props, ctx) {
    const dragState = reactive({
      showDropIndicator: false,
      draggingNode: null,
      dropNode: null,
      allowDrop: true,
      dropType: ''
    });

    const treeClass = computed(() => {
      const clazz = ['el-tree'];
      if (props.highlightCurrent) {
        clazz.push('el-tree--highlight-current');
      }
      if (dragState.draggingNode) {
        clazz.push('is-dragging');
      }
      if (dragState.allowDrop) {
        clazz.push('is-drop-not-allow');
      }
      if (dragState.dropType === 'inner') {
        clazz.push('is-drop-inner');
      }
      return clazz;
    });

    const checkedKeys = watchRef(
      toRef(props, 'checkedKeys'),
      (value) => ctx.emit('update:checkedKeys', value)
    );

    return () => {
      const { dataSource, emptyText, checkStrictly } = props;
      return (
        <div class={treeClass.value} role="tree">
          <CdkTree
            data={dataSource}
            v-model={[checkedKeys.value, 'checkedKeys']}
            getChilren={(data) => data.children}
            trackBy={(data) => data.key}
            checkStrictly={checkStrictly}
            v-slots={{
              default: (data: TreeNodeSlotData<TreeNodeData>) => (
                <Content
                  v-models={[
                    [data.state.checked, 'checked'],
                    [data.state.expanded, 'expanded']
                  ]}
                  showCheckbox={true}
                  indent={data.level * props.indent}
                  label={data.node.label}
                  children={data.children}
                />
              )
            }}
          />
          {dataSource.length === 0 ? (
            <div class="el-tree__empty-block">
              <span class="el-tree__empty-text">{emptyText}</span>
            </div>
          ) : null}
          <div
            v-show={dragState.showDropIndicator}
            class="el-tree__drop-indicator"
            ref="dropIndicator"
          />
        </div>
      );
    };
  },
});