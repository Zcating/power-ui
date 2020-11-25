export class CdkTimer {
  private timerId?: number;

  constructor(
    private readonly fn: () => void,
    private readonly duration: number,
  ) { }

  start() {
    if (this.timerId) {
      window.clearTimeout(this.timerId);
    }
    this.timerId = window.setTimeout(this.fn, this.duration);

    return this;
  }

  end() {
    window.clearTimeout(this.timerId);
    return this;
  }
}