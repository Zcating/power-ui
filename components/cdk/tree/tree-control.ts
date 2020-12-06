import { computed, inject, InjectionKey, provide, Ref, watch } from 'vue';
import { CdkTreeNodeState, GetChildren, TrackBy } from './types';



const token = Symbol() as InjectionKey<TreeControl>;
export const useTreeControl = <T = any>() => {
  return inject<TreeControl<T> | null>(token, null);
};


export class TreeControl<T = any> {
  private readonly stateMap = new Map<string | number, CdkTreeNodeState>();

  get multiple() {
    return this.multipleRef.value;
  }

  get checkStrictly() {
    return this.checkStrictlyRef.value;
  }

  constructor(
    public readonly dataSource: T[],
    public readonly getChildren: GetChildren<T>,
    public readonly trackBy: TrackBy<T>,
    private readonly multipleRef: Ref<boolean>,
    private readonly checkStrictlyRef: Ref<boolean>,
    private readonly checkedKeys: Ref<(string | number)[]>
  ) {
    provide(token, this);
  }

  /**
   * @function observe
   * @param model the datasource's index data
   * @param state 
   */
  observe(model: T, state: CdkTreeNodeState) {
    const { trackBy, stateMap } = this;

    stateMap.set(trackBy(model), state);
    watch(() => state.expanded, (value) => {
      if (this.multiple || value === false) {
        return;
      }
      state.sameLevelKeys
        .filter(key => key !== trackBy(model))
        .map(key => stateMap.get(key))
        .forEach(sameLevelState => {
          if (sameLevelState) {
            sameLevelState.expanded = false;
          }
        });
    });

    watch(() => state.checked, (value) => {
      const { checkStrictly, checkedKeys } = this;

      if (checkStrictly) {
        state.subDeepKeys
          .map((key) => stateMap.get(key))
          .forEach((childState) => childState && (childState.checked = value));
      }

      if (value) {
        checkedKeys.value = [...new Set([...checkedKeys.value, ...state.subDeepKeys, trackBy(model)])];
      } else {
        const keys = [...state.subDeepKeys, this.trackBy(model)];
        checkedKeys.value = checkedKeys.value.filter(key => keys.indexOf(key) !== -1);
      }
    });
  }

  /**
   * 
   * @param models 
   */
  expandTreeKey(models: T[]) {
    const { trackBy, getChildren } = this;
    const keySource: (string | number)[] = [];
    const flatten = (children: T[]) => {
      for (let x = 0; x < children.length; x++) {
        const child = children[x];
        keySource.push(trackBy(child));
        const subChildren = getChildren(child);
        if (Array.isArray(subChildren)) {
          flatten(subChildren);
        }
      }
    };
    flatten(models);
    return keySource;
  }

  /**
   * 
   * @param models 
   */
  getKeys(models: T[]) {
    return models.map(value => this.trackBy(value));
  }
}
