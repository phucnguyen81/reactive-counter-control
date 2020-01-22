import { Observable, pipe } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';

import { Processor } from './processor';
import { CounterState } from './counter.state';
import { SetCount } from './counter.events';
import { SetToProcessor } from './setto.processor';
import { SetToInput, SetToOutput } from './setto.io';

export class CounterSetToControl {
  private readonly setToInput$ = this.counterState$.pipe(
    map<CounterState, number>(state => state.setTo),
    distinctUntilChanged(),
    map<number, SetToInput>(value => ({value}))
  );

  private readonly setToProcessor = new SetToProcessor(this.setToInput$);

  readonly output$ = this.setToProcessor.output$.pipe(
    filter<SetToOutput>(output => output.saved),
    map<SetToOutput, SetCount>(output => {
      return new SetCount(output.value);
    })
  );

  readonly value$: Observable<number> = this.setToProcessor.output$.pipe(
    map<SetToOutput, number>(output => output.value)
  );

  constructor(private readonly counterState$: Observable<CounterState>) {}

  update(value: number): void {
    this.setToProcessor.update(value);
  }

  save(): void {
    this.setToProcessor.save();
  }
}
