import {
  Component, OnInit, OnDestroy, ChangeDetectionStrategy
} from '@angular/core';

import * as rx from 'rxjs';
import * as op from 'rxjs/operators';

import { State, View, createState } from './counter.io';
import { TickService } from './tick.service';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnInit, OnDestroy {

  private initialState: State = createState({inputSetTo: 1});

  // The state of the component
  private state$ = new rx.BehaviorSubject<State>(this.initialState);

  // map State to View
  view$: rx.Observable<View> = this.state$.pipe(
    op.map(state => ({
      digits: String(state.count).split(''),
      inputSetTo: state.inputSetTo,
      speed: state.speedInMs,
      step: state.step,
      color: state.color,
    })),
    op.shareReplay(1)
  );

  private tickService = new TickService();

  private subscription = new rx.Subscription();

  private get state(): State {
    return this.state$.value;
  }

  ngOnInit(): void {
    //  Handle inputs from services
    this.subscription.add(this.tickService.tick$.pipe(
      op.tap(() => this.tick())
    ).subscribe());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Updates state given a partial state change:
   * 1. Calculates dependent state variables
   * 2. Executes side effects on certain state transitions
   * @param change The partial state update
   */
  private updateState(change: Partial<State>): void {
    const patch: Partial<State> = {};

    if (!this.state.active && change.active === true) {
      this.tickService.start(this.state.speedInMs);
    }
    if (this.state.active && change.active === false) {
      this.tickService.stop();
    }
    if (this.state.active && change.speedInMs !== undefined
      && change.active === undefined) {
        this.tickService.start(change.speedInMs);
    }
    if (change.saveSetTo !== undefined) {
      patch.count = change.saveSetTo;
    }

    const newState = createState(this.state, change, patch);
    this.state$.next(newState);
  }

  private tick(): void {
    const sign = this.state.countUp ? 1 : -1;
    this.updateState({
      count: (this.state.count + (sign * this.state.step))
    });
  }

  start(): void {
    this.updateState({active: true});
  }

  pause(): void {
    this.updateState({active: false});
  }

  reset(): void {
    this.updateState(this.initialState);
  }

  inputSetTo(value: string): void {
    const inputSetTo = Number(value);
    if (!isNaN(inputSetTo)) {
      this.updateState({inputSetTo});
    }
  }

  saveSetTo(): void {
    if (this.state.inputSetTo !== undefined) {
      this.updateState({saveSetTo: this.state.inputSetTo});
    }
  }

  countUp(): void {
    if (!this.state.countUp) {
      this.updateState({countUp: true});
    }
  }

  countDown(): void {
    if (this.state.countUp) {
      this.updateState({countUp: false});
    }
  }

  tickSpeed(value: string): void {
    const speedInMs = Number(value);
    if (!isNaN(speedInMs)) {
      this.updateState({speedInMs});
    }
  }

  countDiff(value: string): void {
    const countDiff = Number(value);
    if (!isNaN(countDiff)) {
      this.updateState({step: countDiff});
    }
  }

  setColor(value: string): void {
    const color = (this.state.color === value) ? '' : value;
    this.updateState({color});
  }
}
