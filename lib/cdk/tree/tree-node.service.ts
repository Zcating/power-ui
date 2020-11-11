import { TreeData } from "./tree-node";

export interface TreeNodeData {
  label: string;
  value?: any;
  children?: TreeNodeData[];
}
export default class CdkTreeNode {
  currentNode: TreeData | null = null;
  currnetNodeIndex = 0;
  currentNodeList: TreeNodeData[] = [];
  currentNodeListLayer = 0;
  // constructor() {}
}
