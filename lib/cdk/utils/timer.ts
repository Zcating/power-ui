export class CdkTimer {
  private timerId?: number;

  constructor(
    private readonly fn: () => void,
    private readonly duration: number,
  ) { }

  start() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.timerId = setTimeout(this.fn, this.duration);

    return this;
  }

  end() {
    clearTimeout(this.timerId);
    return this;
  }
}