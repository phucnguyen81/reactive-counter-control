import {
  Component, OnInit, OnDestroy, ChangeDetectionStrategy
} from '@angular/core';

import * as rx from 'rxjs';
import * as op from 'rxjs/operators';

@Component({
  selector: 'app-counter2',
  templateUrl: './counter2.component.html',
  styleUrls: ['./counter2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Counter2Component implements OnInit, OnDestroy {

  // collect streams
  start$ = new rx.Subject<any>();
  start(): void { this.start$.next(true); }

  pause$ = new rx.Subject<any>();
  pause(): void { this.pause$.next(true); }

  saveSetTo$ = new rx.Subject<any>();
  saveSetTo(): void { this.saveSetTo$.next(true); }

  inputSetTo$ = new rx.Subject<string>();
  inputSetTo(value: string): void { this.inputSetTo$.next(value); }

  reset$ = new rx.Subject<any>();
  reset(): void { this.reset$.next(true); }

  countUp$ = new rx.Subject<any>();
  countUp(): void { this.countUp$.next(true); }

  countDown$ = new rx.Subject<any>();
  countDown(): void { this.countDown$.next(true); }

  tickSpeed$ = new rx.Subject<string>();
  tickSpeed(value: string): void { this.tickSpeed$.next(value); }

  countDiff$ = new rx.Subject<string>();
  countDiff(value: string): void { this.countDiff$.next(value); }

  color$ = new rx.Subject<string>();
  setColor(value: string): void { this.color$.next(value); }

  initialState = new State();

  // external port
  intent = new rx.Subject<Intent>();

  // merge all input streams as Intent
  intent$: rx.Observable<Intent> = rx.merge(
    this.intent.asObservable(),
    this.start$.pipe(op.map(x => ({start: true}))),
    this.pause$.pipe(op.map(x => ({pause: true}))),
    this.saveSetTo$.pipe(op.map(x => ({saveSetTo: true}))),
    this.inputSetTo$.pipe(
      mapNumber(), op.map(inputSetTo => ({inputSetTo}))
    ),
    this.reset$.pipe(op.map(x => ({reset: this.initialState}))),
    this.countUp$.pipe(op.map(x => ({countUp: true}))),
    this.countDown$.pipe(op.map(x => ({countDown: true}))),
    this.tickSpeed$.pipe(
      mapNumber(), op.map(tickSpeed => ({tickSpeed}))
    ),
    this.countDiff$.pipe(
      mapNumber(), op.map(countDiff => ({countDiff}))
    ),
    this.color$.pipe(op.map(color => ({color}))),
  );

  // reduce Input to State
  state$: rx.Observable<State> = this.intent$.pipe(
    op.scan(reduceState, this.initialState),
    op.startWith(this.initialState)
  );

  // observe state to trigger side-effect
  tick$: rx.Observable<Intent> = this.state$.pipe(
    op.distinctUntilChanged((oldState, newState) => (
      oldState.active === newState.active
      && oldState.speedInMs === newState.speedInMs
    )),
    op.switchMap(state => {
      return (state.active ? rx.interval(state.speedInMs): rx.EMPTY);
    }),
    op.mapTo({tick: 1})
  );

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

  subscription = new rx.Subscription();

  constructor() { }

  ngOnInit(): void {
    this.subscription.add(this.tick$.subscribe(this.intent));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

class Intent {
  tick?: any;
  start?: any;
  pause?: any;
  inputSetTo?: number;
  saveSetTo?: any;
  reset?: State;
  countUp?: any;
  countDown?: any;
  tickSpeed?: number;
  countDiff?: number;
  color?: string;
  error?: any;
}

class State {
  count: number = 0;
  active: boolean = false;
  inputSetTo: number = 0;
  saveSetTo?: number;
  countUp: boolean = true;
  step: number = 1;
  speedInMs: number = 1000;
  color: string = '';
}

class View {
  digits: string[] = [];
  inputSetTo: number = 1;
  speed: number = 1000;
  step: number = 1;
  color: string = '';
}

function mapNumber(): rx.OperatorFunction<any, number> {
  return function(input$: rx.Observable<any>): rx.Observable<number> {
    return input$.pipe(
      op.map(input => Number(input)),
      op.filter(num => (!isNaN(num))),
    );
  }
}

function reduceState(state: State, event: Intent): State {
  if (event.tick) {
    const sign = (state.countUp ? 1 : -1);
    return {...state, count: (state.count + (sign * state.step))};
  }
  if (event.start && !state.active) {
    return {...state, active: true};
  }
  if (event.pause && state.active) {
    return {...state, active: false};
  }
  if (event.reset) {
    return {...state, ...(event.reset)};
  }
  if (event.inputSetTo !== undefined) {
    return {...state, inputSetTo: event.inputSetTo};
  }
  if ((event.saveSetTo !== undefined)
    && (state.inputSetTo !== undefined)) {
    return {...state,
      count: state.inputSetTo, inputSetTo: state.inputSetTo
    };
  }
  if (event.countUp && !state.countUp) {
    return {...state, countUp: true};
  }
  if (event.countDown && state.countUp) {
    return {...state, countUp: false};
  }
  if (event.tickSpeed !== undefined) {
    return {...state, speedInMs: event.tickSpeed};
  }
  if (event.countDiff !== undefined) {
    return {...state, step: event.countDiff};
  }
  if (event.color !== undefined) {
    return {...state, color: event.color};
  }
  return state;
}
