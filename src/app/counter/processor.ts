import {
  Subject, Observable, Observer, Subscriber, Subscription,
  OperatorFunction, merge, EMPTY
} from 'rxjs';

import { takeUntil } from 'rxjs/operators';

export class Processor<I, O> implements Observer<I> {
  private readonly input = new Subject<I>();

  readonly output$: Observable<O> = merge(
    this.input, this.controlInput
  ).pipe(this.process);

  get closed(): boolean {
    return this.input.closed;
  }

  constructor(
    private readonly controlInput: Observable<I>,
    private readonly process: OperatorFunction<I, O>
  ) { }

  send(event: I): void {
    this.input.next(event);
  }

  next(event: I): void {
    this.input.next(event);
  }

  error(err: any): void {
    this.input.error(err);
  }

  complete(): void {
    this.input.complete();
  }
}
