export class DeferredResource<T> {
  constructor(public readonly pending: boolean, public readonly error: any, public readonly response: T) {}

  static pending<T>(): DeferredResource<T> {
    return new DeferredResource(true, undefined, undefined);
  }

  static error<T>(err): DeferredResource<T> {
    return new DeferredResource(false, err, undefined);
  }

  static success<T>(result: T): DeferredResource<T> {
    return new DeferredResource(false, undefined, result);
  }

  get hasData(): boolean {
    return !!this.response;
  }

  get isSuccess(): boolean {
    return !this.pending && !this.error && !!this.response;
  }

  get isPending() {
    return this.pending && !this.response;
  }

  get isReFetching(): boolean {
    return this.pending && !!this.response;
  }

  merge(other: DeferredResource<T> | null): DeferredResource<T> {
    if (!other) {
      return this;
    }
    return new DeferredResource<T>(this.pending, this.error, this.response || other.response);
  }

  unwrap<V>(selector: (response: T) => V): DeferredResource<V> {
    if (this.response) {
      return new DeferredResource<V>(this.pending, this.error, selector(this.response));
    }
    return ((this as unknown) as DeferredResource<V>);
  }
}

