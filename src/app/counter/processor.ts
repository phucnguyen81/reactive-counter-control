import {
  Subject, Observable, Observer, EMPTY,
  OperatorFunction, merge
} from 'rxjs';

export class Processor<I, O> implements Observer<I> {
  private readonly inputSubject = new Subject<I>();

  private input$: Observable<I> = this.inputSubject.asObservable();

  output$: Observable<O> = this.input$.pipe(this.process);

  constructor(private readonly process: OperatorFunction<I, O>) {}

  receive(inputControl$: Observable<I>): void {
    this.input$ = merge(this.input$, inputControl$);
    this.output$ = this.input$.pipe(this.process);
  }

  connect(processor: Processor<O, any>): void {
    processor.receive(this.output$);
  }

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
