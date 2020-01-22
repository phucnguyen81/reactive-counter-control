import { Observable, Subscription, merge, EMPTY } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { CounterState, CounterInitialState } from './counter.state';
import { CounterEvent, Tick } from './counter.events';

import { CounterProcessor } from './counter.processor';
import { CounterTickControl } from './counter-tick.control';
import { CounterSetToControl } from './counter-setto.control';

export class CounterControl {

  private readonly counter = new CounterProcessor(EMPTY);

  // shareReplay to share with tick and setTo
  readonly output$ = this.counter.output$.pipe(shareReplay(1));

  private readonly tick = new CounterTickControl(this.output$);

  private readonly setTo = new CounterSetToControl(this.output$);

  readonly setToValue$: Observable<number> = this.setTo.value$;

  private readonly effect$: Observable<CounterEvent> =
    merge<CounterEvent>(
      this.tick.output$,
      this.setTo.output$,
    );

  subscribe(): Subscription {
    return this.effect$.subscribe(this.counter);
  }

  init(initialState?: CounterInitialState): void {
    this.counter.init(initialState);
  }

  start(): void { this.counter.start(); }
  pause(): void { this.counter.pause(); }
  reset(): void { this.counter.reset(); }
  countUp(): void { this.counter.countUp(); }
  countDown(): void { this.counter.countDown(); }
  tickSpeed(speed: number): void { this.counter.tickSpeed(speed); }
  countDiff(diff: number): void { this.counter.countDiff(diff); }
  setColor(color: string): void { this.counter.setColor(color); }

  updateSetTo(value: number): void { this.setTo.update(value); }
  saveSetTo(): void { this.setTo.save(); }
}
