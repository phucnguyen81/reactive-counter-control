import { Subject, Observable, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CounterState, CounterInitialState } from './counter.state';
import { CounterEvent } from './counter.events';

import { CounterCoreControl } from './counter.core.control';
import { CounterTickControl } from './counter.tick.control';
import { CounterSetToControl } from './counter.setto.control';

export class CounterControl {
  private readonly coreControl = new CounterCoreControl();

  readonly output$: Observable<CounterState> = this.coreControl.output$;

  private readonly tickControl = new CounterTickControl(this.output$);

  private readonly setToControl = new CounterSetToControl(this.output$);

  readonly setToValue$: Observable<number> = this.setToControl.value$;

  private readonly effect$: Observable<CounterEvent> =
    merge<CounterEvent>(
      this.tickControl.output$,
      this.setToControl.output$,
    );

  private readonly close$ = new Subject<any>();

  init(initialState?: CounterInitialState): void {
    this.close();
    this.effect$.pipe(takeUntil(this.close$)).subscribe(
      event => this.coreControl.send(event),
      // TODO add special error handling for this case
      error => console.error(
        'This error should be handled inside effect', error
      ),
    );
    this.coreControl.init(initialState);
  }

  close(): void {
    this.close$.next(true);
  }

  start(): void { this.coreControl.start(); }
  pause(): void { this.coreControl.pause(); }
  reset(): void { this.coreControl.reset(); }
  countUp(): void { this.coreControl.countUp(); }
  countDown(): void { this.coreControl.countDown(); }
  tickSpeed(speed: number): void { this.coreControl.tickSpeed(speed); }
  countDiff(diff: number): void { this.coreControl.countDiff(diff); }
  setColor(color: string): void { this.coreControl.setColor(color); }

  saveSetTo(): void { this.setToControl.save(); }
  updateSetTo(value: number): void { this.setToControl.update(value); }
}
