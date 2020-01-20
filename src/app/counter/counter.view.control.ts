import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CounterControl } from './counter.control';
import { CounterState } from './counter.state';

export class CounterViewOutput {
  readonly digits = String(this.state.count).split('');
  readonly color = this.state.color;
  readonly speed = this.state.speed;
  readonly step = this.state.step;

  constructor(private state: CounterState) { }
}

export class CounterViewControl {
  private readonly control = new CounterControl();

  readonly output$: Observable<CounterViewOutput> =
    this.control.output$.pipe(
      map(state => { return new CounterViewOutput(state); })
    );

  readonly setToValue$: Observable<number> = this.control.setToValue$;

  init(): void { this.control.init(); }
  destroy(): void { this.control.close(); }

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
