import { defineComponent, inject, provide } from "vue";

export interface TreeData {
  label: any;
  value: any;
  content: any;
  children: TreeData[];
}

export const CdkTreeNode = defineComponent({
  name: "cdk-tree-node",
  props: {
    index: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    const nodeList = inject("cdk-tree-node");
    const currentNode: TreeData = (nodeList as any)?.[props.index];
    if (!nodeList || !currentNode) {
      return () => null;
    }
    if (currentNode.children) {
      provide("cdk-tree-node", currentNode.children);
    }
    provide("cdk-current-tree-node", currentNode);
    const layer = (inject("cdk-tree-node-layer") as number) || 0;
    provide("cdk-tree-current-node-layer", layer);
    provide("cdk-tree-node-layer", layer + 1);
    return () => (
      <div style={{ marginLeft: layer * 20 + "px" }}>
        <div>{currentNode.label}</div>
        <div>{currentNode.content}</div>
        {currentNode.children?.map?.((_, key) => (
          <CdkTreeNode key={key} index={key} />
        ))}
      </div>
    );
  },
});
