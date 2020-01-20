import { Subject, Observable, merge } from 'rxjs';
import { scan, shareReplay, map } from 'rxjs/operators';

import {
  CounterEvent, Init, Start, Pause, Reset, CountUp,
  CountDown, TickSpeed, CountDiff, Color, SetCount, Tick
} from './counter.events';

import {
  CounterState, CounterInitialState, DEFAULT_INITIAL_STATE
} from './counter.state';

import { nextState } from './counter.reducer';

export class CounterCoreControl {
  private readonly input$ = new Subject<CounterEvent>();

  // output is state, use shareReplay to get the last state
  readonly output$: Observable<CounterState> = this.input$.pipe(
    scan<CounterEvent, CounterState>(
      nextState, DEFAULT_INITIAL_STATE
    ),
    shareReplay(1)
  );

  send(event: CounterEvent): void { this.input$.next(event); }

  init(initialState?: CounterInitialState): void {
    this.send(new Init(initialState || DEFAULT_INITIAL_STATE));
  }

  start(): void { this.send(new Start()); }
  pause(): void { this.send(new Pause()); }
  reset(): void { this.send(new Reset()); }
  countUp(): void { this.send(new CountUp()); }
  countDown(): void { this.send(new CountDown()); }
  tickSpeed(speed: number): void { this.send(new TickSpeed(speed)); }
  countDiff(diff: number): void { this.send(new CountDiff(diff)); }
  setColor(color: string): void { this.send(new Color(color)); }
}
