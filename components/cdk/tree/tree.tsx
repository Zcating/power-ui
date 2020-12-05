import { defineComponent, inject, provide, shallowReactive, shallowRef, watch } from 'vue';
import { List, Method, thenable } from 'vue-cdk/utils';
import { TreeControl, useTreeControl } from './tree-control';
import { CdkTreeNodeState, GetChildren, TrackBy } from './types';
export interface CdkTreeNodeData<T = any> {
  children?: CdkTreeNodeData<T>[];
}

export interface TreeNodeSlotData<T = any> {
  state: {
    checked: boolean,
    expanded: boolean,
    loading: boolean
  };
  node: T;
  layer: number;
  children: JSX.Element[];
  isLeaf: boolean;
}


const CdkTreeNode = defineComponent({
  name: 'cdk-tree-node',
  props: {
    nodeData: { type: Object, required: true }
  },
  setup(props, ctx) {

    const layer = inject('cdk-tree-node-layer', 0);
    provide('cdk-tree-node-layer', layer + 1);

    const state = shallowReactive<CdkTreeNodeState>({
      checked: false,
      expanded: false,
      loading: false,
      keys: []
    });

    const nodesRef = shallowRef<Record<string, any>[]>([]);

    const control = useTreeControl();
    if (!control) {
      throw Error('control is not null!');
    }
    control.observe(props.nodeData, state);

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
        state.keys = nodes.map(() => control.trackBy(nodes));
      });
    }

    return () => {
      const nodes = nodesRef.value;

      const isLeaf = nodes.length === 0;
      const children = !isLeaf ? nodes.map((node) => (
        <CdkTreeNode key={control.trackBy(node)} nodeData={node} v-slots={{ ...ctx.slots }} />
      )) : [];

      return ctx.slots.default?.({ state, node: currentNode, layer, children, isLeaf });
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
    }
  },

  setup(props, ctx) {
    const control = new TreeControl(props.data, props.getChilren, props.trackBy);

    return () => {
      return props.data.map((node) => (
        <CdkTreeNode key={control.trackBy(node)} nodeData={node} v-slots={{ ...ctx.slots }} />
      ));
    };
  }
});
