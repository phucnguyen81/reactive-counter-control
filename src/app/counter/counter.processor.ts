import { Observable, pipe, EMPTY } from 'rxjs';
import { scan } from 'rxjs/operators';

import { Processor } from './processor';
import {
  CounterEvent, CounterState, CounterInitialState,
  DEFAULT_INITIAL_STATE
} from './counter.io';
import { nextState } from './counter.reducer';

export class CounterProcessor extends
  Processor<CounterEvent, CounterState>
{
  constructor(
    private readonly counterInput$: Observable<CounterEvent>
  ) {
    super(
      counterInput$,
      scan<CounterEvent, CounterState>(
        nextState, DEFAULT_INITIAL_STATE
      )
    );
  }

  init(initialState?: CounterInitialState): void {
    this.send({init: (initialState || DEFAULT_INITIAL_STATE)});
  }

  start(): void { this.send({start: true}); }
  pause(): void { this.send({pause: true}); }
  reset(): void { this.send({reset: true}); }
  countUp(): void { this.send({countUp: true}); }
  countDown(): void { this.send({countDown: true}); }
  tickSpeed(speed: number): void { this.send({tickSpeed: speed}); }
  countDiff(diff: number): void { this.send({countDiff: diff}); }
  setColor(color: string): void { this.send({color: color}); }
}
