import { computed, defineComponent, provide, reactive, toRef } from 'vue';
import { List } from 'vue-cdk/utils';
import { CdkTree, TreeNodeSlotData } from 'vue-cdk/tree';
import { TreeNodeContent } from './tree-node-content';


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
    props: {
      default: {
        children: 'children',
        label: 'label',
        disabled: 'disabled'
      }
    },
    lazy: {
      type: Boolean,
      default: false
    },
    indent: {
      type: Number,
      default: 18
    },
    checkOnClickNode: Boolean,
    defaultCheckedKeys: Array,
    defaultExpandedKeys: Array,
    currentNodeKey: [String, Number],
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

    provide('cdk-tree-node-layer', 0);

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

    return () => {
      const { dataSource, emptyText } = props;
      return (
        <div class={treeClass.value} role="tree">
          <CdkTree
            data={dataSource}
            getChilren={(data) => data.children}
            trackBy={(data) => data.key}
            v-slots={{
              default: (data: TreeNodeSlotData<TreeNodeData>) => {
                return <TreeNodeContent
                  showCheckbox={true}
                  indent={data.layer * props.indent}
                  isLeaf={data.isLeaf}
                  label={data.node.label}
                  children={data.children}
                  v-model={[data.state.checked, 'checked']}
                />;
              }
            }}
          />
          {dataSource.length === 0 ?
            (
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