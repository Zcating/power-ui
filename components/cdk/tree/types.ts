
export type GetChildren<T> = (this: void, data: T) => (T[] | Promise<T[]> | null | undefined);

export type TrackBy<T> = (this: void, data: T) => (string | number);

export interface CdkTreeNodeState {
  checked: boolean;
  expanded: boolean;
  loading: boolean;
  subKeys: (string | number)[];
  subDeepKeys: (string | number)[];
  sameLevelKeys: (string | number)[];
}

export interface TreeNodeSlotData<T = any> {
  state: CdkTreeNodeState;
  node: T;
  level: number;
  children: JSX.Element[];
  isLeaf: boolean;
}
