
export type GetChildren<T> = (this: void, data: T) => (T[] | Promise<T[]> | null | undefined);

export type TrackBy<T> = (this: void, data: T) => (string | number);

export interface CdkTreeNodeState {
  checked: boolean;
  expanded: boolean;
  loading: boolean;
  keys: (string | number)[]
}