import { Subject, Observable, OperatorFunction, merge, pipe } from 'rxjs';
import { map, withLatestFrom, distinctUntilChanged, filter } from 'rxjs/operators';

import { SetCount } from './counter.events';
import { CounterState } from './counter.state';

export class SetToOutput {
  readonly value: number;
  readonly saved: boolean;
}

export class SetToControl {
  private readonly value$ = new Subject<number>();

  private readonly valueOut$: Observable<number> = merge(
    this.valueIn$,
    this.value$,
  );

  private readonly saveValue$ = new Subject<any>();

  private readonly valueSaved$: Observable<number> =
    this.saveValue$.pipe(
      withLatestFrom(this.valueOut$, (_, value) => value)
    );

  readonly output$: Observable<SetToOutput> = merge(
    this.valueOut$.pipe(
      map<number, SetToOutput>(value => ({value, saved: false}))
    ),
    this.valueSaved$.pipe(
      map<number, SetToOutput>(value => ({value, saved: true}))
    ),
  );

  constructor(private readonly valueIn$: Observable<number>) { }

  update(value: number): void {
    this.value$.next(value);
  }

  save(): void {
    this.saveValue$.next(true);
  }
}

