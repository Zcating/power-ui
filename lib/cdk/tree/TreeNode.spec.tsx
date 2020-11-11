import { defineComponent, provide } from "vue";
import { CdkTreeNode } from "./tree-node";

export default defineComponent({
  name: "cdk-tree-node-spec",
  setup() {
    const testData = [
      {
        label: "test",
        content: "tttttttt",
        value: 1,
        children: [
          { label: "test", content: "tttttttt" },
          { label: "test", content: "tttttttt" },
          { label: "test", content: "tttttttt" },
          { label: "test", content: "tttttttt" },
          { label: "test", content: "tttttttt" },
          { 
            label: "test2", 
            content: '111', 
            children: [
              {label: 'test3', content: 'tttttttt'}
            ] 
          }
        ],
      },
    ];
    provide("cdk-tree-node", testData);
    provide("cdk-tree-node-layer", 0);
    return () => (
      <>
        {testData.map((_, key) => (
          <CdkTreeNode key={key} index={key} />
        ))}
      </>
    );
  },
});
