import {
  Component, OnInit, OnDestroy, ChangeDetectionStrategy
} from '@angular/core';

import * as rx from 'rxjs';
import * as op from 'rxjs/operators';

import { Input, State, View, createState } from './counter.io';
import { reduceState } from './counter.reducer';
import { mapNumber } from './counter.operators';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnInit, OnDestroy {

  // collect input streams
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

  initialState: State = createState({inputSetTo: 1});

  externalInput = new rx.Subject<Input>();

  internalInput$: rx.Observable<Input> = rx.merge(
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

  // Collects all inputs
  input$: rx.Observable<Input> = rx.merge(
    this.externalInput.asObservable(),
    this.internalInput$,
  );

  // Next state is derived from current state and input event
  state$: rx.Observable<State> = this.input$.pipe(
    op.scan(reduceState, this.initialState),
    op.startWith(this.initialState)
  );

  // Triggers side-effects from state transitions
  tick$: rx.Observable<Input> = this.state$.pipe(
    op.distinctUntilChanged((oldState, newState) => (
      oldState.active === newState.active
      && oldState.speedInMs === newState.speedInMs
    )),
    op.switchMap(state => {
      return (state.active ? rx.interval(state.speedInMs): rx.EMPTY);
    }),
    op.mapTo({tick: 1})
  );

  // Transforms state to view
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

  ngOnInit(): void {
    // create feedback loop for side-effect
    this.subscription.add(this.tick$.subscribe(this.externalInput));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
