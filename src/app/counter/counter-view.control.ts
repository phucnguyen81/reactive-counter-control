import { Observable } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';

import { CounterControl } from './counter.control';
import { CounterState } from './counter.io';
import { CounterViewOutput } from './counter-view.io';

export class CounterViewControl {
  private readonly control = new CounterControl();

  readonly output$: Observable<CounterViewOutput> =
    this.control.output$.pipe(
      map<CounterState, CounterViewOutput>(state => {
        return {
          color: state.color,
          digits: String(state.count).split(''),
          speed: state.speed,
          step: state.step,
        };
      }),
      shareReplay(1),
      // TODO proper logging to report errors
      catchError((err, caught) => {
        console.error('Unhandled error', err);
        return caught;
      })
    );

  readonly setToValue$: Observable<number> = this.control.setToValue$;

  private readonly subscription = this.control.subscribe();
  init(): void { this.control.init(); }
  destroy(): void { this.subscription.unsubscribe(); }

  start(): void { this.control.start(); }
  pause(): void { this.control.pause(); }
  reset(): void { this.control.reset(); }
  countUp(): void { this.control.countUp(); }
  countDown(): void { this.control.countDown(); }

  tickSpeed(speed: number): void { this.control.tickSpeed(speed); }
  countDiff(diff: number): void { this.control.countDiff(diff); }
  setColor(color: string): void { this.control.setColor(color); }

  saveSetTo(): void { this.control.saveSetTo(); }
  updateSetTo(value: number): void { this.control.updateSetTo(value); }
}
