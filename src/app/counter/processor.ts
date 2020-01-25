import {
  Subject, Observable, Observer,
  OperatorFunction, merge
} from 'rxjs';

export class Processor<I, O> implements Observer<I> {
  private readonly inputSubject = new Subject<I>();

  readonly output$: Observable<O> = merge(
    this.inputSubject, this.inputControl$
  ).pipe(this.process);

  constructor(
    private readonly inputControl$: Observable<I>,
    private readonly process: OperatorFunction<I, O>
  ) {}

  send(event: I): void {
    this.inputSubject.next(event);
  }

  get closed(): boolean {
    return this.inputSubject.closed;
  }

  next(event: I): void {
    this.inputSubject.next(event);
  }

  error(err: any): void {
    this.inputSubject.error(err);
  }

  complete(): void {
    this.inputSubject.complete();
  }
}
