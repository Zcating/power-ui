import { computed, defineComponent, provide, reactive } from 'vue';
import { CdkTreeNode, TreeNodeData } from '../cdk';

export default defineComponent({
  props: {
    data: {
      type: Array as () => TreeNodeData[],
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
    const { data, emptyText, highlightCurrent, } = props;
    provide("cdk-tree-node", data);
    provide("cdk-tree-node-layer", 0);
    
    const dragState = reactive({
      showDropIndicator: false,
      draggingNode: null,
      dropNode: null,
      allowDrop: true,
      dropType: ''
    });

    const treeClass = computed(() => {
      const clazz = ['el-class'];
      if (highlightCurrent) {
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

    // const isEmpty = computed(() => {
    //   const { childNodes } = this.root;
    //   return !childNodes || childNodes.length === 0 || childNodes.every(({ visible }) => !visible);
    // })

    return () => (
      <div class={treeClass.value} role="tree">
        {data.map((_, key) => (
          <CdkTreeNode key={key} index={key} />
        ))}
        <div class="el-tree__empty-block">
          <span class="el-tree__empty-text">{{ emptyText }}</span>
        </div>
        <div
          v-show={dragState.showDropIndicator}
          class="el-tree__drop-indicator"
          ref="dropIndicator"
        >
        </div>
      </div>
    );
  },
});