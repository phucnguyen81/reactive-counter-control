import { Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';

import { CounterEvent, CounterState } from './counter.io';
import { TickInput, TickOutput } from './tick.io';
import { TickProcessor } from './tick.processor';

export class CounterTickControl {
  private readonly tickInput$ = this.counterState$.pipe(
    map<CounterState, TickInput>((state) => {
      return new TickInput(state.running, state.speed);
    })
  );

  private readonly tickProcessor = new TickProcessor(this.tickInput$);

  readonly output$ = this.tickProcessor.output$.pipe(
    mapTo<TickOutput, CounterEvent>({tick: true})
  );

  constructor(
    private readonly counterState$: Observable<CounterState>
  ) {}
}
