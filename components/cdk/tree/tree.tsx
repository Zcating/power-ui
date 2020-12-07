import { defineComponent, inject, provide, shallowReactive, shallowRef, toRef, watch } from 'vue';
import { watchRef } from 'vue-cdk/hook';
import { List, Method, thenable } from 'vue-cdk/utils';
import { TreeControl, useTreeControl } from './tree-control';
import { CdkTreeNodeState, GetChildren, TrackBy } from './types';


const CdkTreeNode = defineComponent({
  name: 'cdk-tree-node',
  props: {
    nodeData: { type: Object, required: true },
    sameLevelKeys: { type: List<string | number>(), required: true },
  },
  setup(props, ctx) {

    const level = inject('cdk-tree-node-level', 0);
    provide('cdk-tree-node-level', level + 1);



    const control = useTreeControl();
    if (!control) {
      throw Error('control is not null!');
    }
    // observe state
    const state = shallowReactive<CdkTreeNodeState>({
      checked: false,
      expanded: false,
      loading: false,
      subKeys: [],
      subDeepKeys: [],
      sameLevelKeys: props.sameLevelKeys
    });
    control.observe(props.nodeData, state);

    /**
     * to get children nodes
     */
    const nodesRef = shallowRef<Record<string, any>[]>([]);
    const currentNode = props.nodeData;
    if (currentNode) {
      const nodes = control.getChildren(currentNode);
      if (thenable(nodes)) {
        state.loading = true;
        nodes.then((value) => {
          state.loading = false;
          nodesRef.value = value;
        }).catch((e) => {
          console.error(e);
          state.loading = false;
        });
      } else if (Array.isArray(nodes)) {
        nodesRef.value = nodes;
      } else {
        nodesRef.value = [];
      }
      watch(nodesRef, (nodes) => {
        state.subKeys = control.getKeys(nodes);
        state.subDeepKeys = control.expandTreeKey(nodes);
      }, { immediate: true });
    }

    return () => {
      const nodes = nodesRef.value;

      const isLeaf = nodes.length === 0;
      const children = !isLeaf ? nodes.map((node) => (
        <CdkTreeNode
          key={control.trackBy(node)}
          nodeData={node}
          sameLevelKeys={state.subKeys}
          v-slots={{ ...ctx.slots }}
        />
      )) : [];

      return ctx.slots.default?.({ state, node: currentNode, level, children, isLeaf });
    };
  },
});



export const CdkTree = defineComponent({
  name: 'cdk-tree',
  props: {
    data: {
      type: List<Record<string, any>>(),
      default: []
    },
    getChilren: {
      type: Method<GetChildren<Record<string, any>>>(),
      required: true
    },
    trackBy: {
      type: Method<TrackBy<Record<string, any>>>(),
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    checkedKeys: {
      type: List<number | string>(),
      default: []
    },
    checkStrictly: {
      type: Boolean,
      default: false
    }
  },

  setup(props, ctx) {
    const control = new TreeControl(
      props.data,
      props.getChilren,
      props.trackBy,
      toRef(props, 'multiple'),
      toRef(props, 'checkStrictly'),
      watchRef(toRef(props, 'checkedKeys'), (value) => ctx.emit('update:checkedKeys', value))
    );

    return () => (
      props.data.map((node) => (
        <CdkTreeNode
          key={control.trackBy(node)}
          nodeData={node}
          sameLevelKeys={control.getKeys(props.data)}
          v-slots={{ ...ctx.slots }}
        />
      ))
    );

  }
});
