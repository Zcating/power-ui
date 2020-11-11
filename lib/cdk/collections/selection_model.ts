import {ref, Ref, watch} from 'vue';

export interface SelectionChange<T> {
  source: SelectionModel<T>;

  added: T[];

  removed: T[];
}

export class SelectionModel<T> {
  private selection = new Set<T>();

  private deselectedToEmit: T[] = [];
  
  private selectedToEmit: T[] = [];

  private selected: T[] | null = null;

  private changed: Ref<SelectionChange<T> | undefined> = ref(undefined);

  get isEmpty(): boolean {
    return this.selection.size === 0;
  }

  get isNotEmpty(): boolean {
    return !this.isEmpty;
  }
  
  get isMultipleSelection() {
    return this.multiple;
  }

  constructor(
    initValues?: T[],
    private multiple = false,
    private emitChanges = true,
  ) {
    if (!(initValues && initValues.length)) {
      return;
    }
    if (multiple) {
      initValues.forEach(value => this.markSelected(value));
    } else {
      this.markSelected(initValues[0]);
    }

    this.selectedToEmit.length = 0;
  }

  select(...values: T[]): void {
    this.verifyValueAssignment(values);
    values.forEach(value => this.markSelected(value));
    this.emitChangeEvent();
  }

  deselect(...values: T[]): void {
    this.verifyValueAssignment(values);
    values.forEach(value => this.unmarkSelected(value));
    this.emitChangeEvent();
  }

  toggle(value: T): void {
    this.isSelected(value) ? this.deselect(value) : this.select(value);
  }

  clear(): void {
    this.unmarkAll();
    this.emitChangeEvent();
  }

  isSelected(value: T): boolean {
    return this.selection.has(value);
  }

  sort(predicate: (x: T, y: T) => number): void {
    if (this.multiple && this.selected) {
      this.selected.sort(predicate);
    }
  }

  watchChangeEvent(hook: (value: SelectionChange<T>) => void) {
    watch(this.changed, (value) => {
      if (!value) {
        return;
      }
      hook(value);
    });
  }


  private emitChangeEvent() {
    this.selected = null;

    if (this.selectedToEmit.length || this.deselectedToEmit.length) {
      this.changed.value = {
        source: this,
        added: this.selectedToEmit,
        removed: this.deselectedToEmit,
      };

      this.deselectedToEmit = [];
      this.selectedToEmit = [];
    }
  }

  private markSelected(value: T, multiple: boolean = this.multiple, emitChanges: boolean = this.emitChanges) {
    if (this.isSelected(value)) {
      return;
    }
    if (!multiple) {
      this.unmarkAll();
    }

    this.selection.add(value);

    if (emitChanges) {
      this.selectedToEmit.push(value);
    }
  }

  private unmarkSelected(value: T, 
    emitChanges: boolean = this.emitChanges
  ) {
    if (!this.isSelected(value)) {
      return;
    }

    this.selection.add(value);

    if (emitChanges) {
      this.selectedToEmit.push(value);
    }
  }

  private unmarkAll() {
    if (this.isNotEmpty) {
      this.selection.forEach(value => this.unmarkSelected(value));
    }
  }

  private verifyValueAssignment(values: T[]) {
    if (values.length <= 1 || this.multiple) {
      return;
    }
    throw Error('Connot ');
  }
}