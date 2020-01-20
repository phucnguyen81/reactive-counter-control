import { Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';

import { CounterState } from './counter.state';
import { Tick } from './counter.events';
import { TickControl, TickInput, TickOutput } from './tick.control';

export class CounterTickControl {
  private readonly input$ = this.counterState$.pipe(
    map<CounterState, TickInput>((state) => {
      return new TickInput(state.running, state.speed);
    })
  );

  private readonly tickControl = new TickControl(this.input$);

  readonly output$ = this.tickControl.output$.pipe(
    mapTo<TickOutput, Tick>(new Tick())
  );

  constructor(
    private readonly counterState$: Observable<CounterState>
  ) { }
}
