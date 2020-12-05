import { inject, InjectionKey, provide, watch } from 'vue';
import { CdkTreeNodeState, GetChildren, TrackBy } from './types';
const token = Symbol() as InjectionKey<TreeControl>;
export const useTreeControl = <T = any>() => {
  return inject<TreeControl<T> | null>(token, null);
};


export class TreeControl<T = any> {
  private readonly stateMap = new Map<string | number, CdkTreeNodeState>();

  constructor(
    public readonly dataSource: T[],
    public readonly getChildren: GetChildren<T>,
    public readonly trackBy: TrackBy<T>
  ) {
    provide(token, this);
  }

  observe(model: T, state: CdkTreeNodeState) {
    const { trackBy, stateMap } = this;

    stateMap.set(trackBy(model), state);
    watch(() => state.expanded, (value) => {
    });

    watch(() => state.checked, (value) => {
      const states = state.keys.map((key) => stateMap.get(key));
      states.map((childState) => childState && (childState.checked = value));
    });
  }

}
