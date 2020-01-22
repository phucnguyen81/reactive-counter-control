import {
  Component, OnInit, OnDestroy, ChangeDetectionStrategy
} from '@angular/core';

import { Observable } from 'rxjs';

import { CounterViewControl } from './counter-view.control';
import { CounterViewOutput } from './counter-view.io';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnInit, OnDestroy {
  private readonly control = new CounterViewControl();

  readonly output$: Observable<CounterViewOutput> = this.control.output$;
  readonly setToValue$: Observable<number> = this.control.setToValue$;

  ngOnInit(): void { this.control.init(); }
  ngOnDestroy(): void { this.control.destroy(); }

  start(): void { this.control.start(); }
  pause(): void { this.control.pause(); }
  reset(): void { this.control.reset(); }
  countUp(): void { this.control.countUp(); }
  countDown(): void { this.control.countDown(); }

  tickSpeed(speed: string): void {
    this.control.tickSpeed(Number(speed));
  }
  countDiff(diff: string): void {
    this.control.countDiff(Number(diff));
  }
  setColor(color: string): void {
    this.control.setColor(color);
  }

  saveSetTo(): void { this.control.saveSetTo(); }
  updateSetTo(value: string): void {
    this.control.updateSetTo(Number(value));
  }
}
