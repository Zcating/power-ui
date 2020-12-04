import { defineComponent, inject, provide } from 'vue';
import { Model } from 'vue-cdk/utils';

// export const cdkTreeNodeToken = Symbol() as InjectionKey<Ref<TreeData[]> | TreeData[]>;

export interface CdkTreeNodeData<T = any> {
  children?: CdkTreeNodeData<T>[];
}


export const CdkTreeNode = defineComponent({
  name: 'cdk-tree-node',
  props: {
    node: {
      type: Model<CdkTreeNodeData>(),
      required: true
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    const currentNode = props.node;
    if (!currentNode) {
      return () => null;
    }

    if (currentNode.children) {
      provide('cdk-tree-node', currentNode.children);
    }

    const layer = inject('cdk-tree-node-layer', 0);
    provide('cdk-tree-node-layer', layer + 1);

    return () => {
      const children = currentNode.children?.map?.((node, key) => (
        <CdkTreeNode key={key} node={node} v-slots={{ ...ctx.slots }} />
      ));
      return ctx.slots.default?.({ layer, children });
    };
  },
});

export const CdkTree = defineComponent({
  name: 'cdk-tree',
  props: {
    index: {
      type: Number,
      default: 0,
    }
  },

});
