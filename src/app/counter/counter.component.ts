import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from "@angular/core";

import * as rx from "rxjs";
import * as op from "rxjs/operators";

import { Input, State, View, createState } from "./counter.io";
import { reduceState } from "./counter.reducer";
import { TickService } from "./tick.service";

@Component({
  selector: "app-counter",
  templateUrl: "./counter.component.html",
  styleUrls: ["./counter.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:  [ TickService ],
})
export class CounterComponent implements OnInit, OnDestroy {

  // Inputs from outside the component
  private externalInput: rx.Observable<Input> = this.tickService.tick$.pipe(
    op.map(() => ({tick: 1}))
  );

  // Inputs from inside the component
  private internalInput = new rx.Subject<Input>();

  // Collects all inputs
  private input$: rx.Observable<Input> = rx.merge(
    this.externalInput,
    this.internalInput
  );

  private initialState: State = createState({ inputSetTo: 1 });

  // Next state is derived from current state and input event
  private state$: rx.Observable<State> = this.input$.pipe(
    op.scan(reduceState, this.initialState),
    op.startWith(this.initialState)
  );

  // Triggers side-effects from state transitions
  private tick$: rx.Observable<State> = this.state$.pipe(
    op.distinctUntilChanged(
      (oldState, newState) =>
        oldState.active === newState.active &&
        oldState.speedInMs === newState.speedInMs
    ),
    op.tap((state) => {
      if (state.active) {
        this.tickService.start(state.speedInMs);
      } else {
        this.tickService.stop();
      }
    })
  );

  // Transforms state to view
  view$: rx.Observable<View> = this.state$.pipe(
    op.map((state) => ({
      digits: String(state.count).split(""),
      inputSetTo: state.inputSetTo,
      speed: state.speedInMs,
      step: state.step,
      color: state.color,
    })),
    op.shareReplay(1)
  );

  private subscription = new rx.Subscription();

  constructor(private tickService: TickService) {}

  ngOnInit(): void {
    // Runs the feedback loop input->side-effect->input
    this.subscription.add(this.tick$.subscribe());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  start(): void {
    this.internalInput.next({ start: true });
  }

  pause(): void {
    this.internalInput.next({ pause: true });
  }

  saveSetTo(): void {
    this.internalInput.next({ saveSetTo: true });
  }

  inputSetTo(value: string): void {
    const inputSetTo = Number(value);
    if (!isNaN(inputSetTo)) {
      this.internalInput.next({ inputSetTo });
    }
  }

  reset(): void {
    this.internalInput.next({ reset: this.initialState });
  }

  countUp(): void {
    this.internalInput.next({ countUp: true });
  }

  countDown(): void {
    this.internalInput.next({ countDown: true });
  }

  tickSpeed(value: string) {
    const tickSpeed = Number(value);
    if (!isNaN(tickSpeed)) {
      this.internalInput.next({ tickSpeed });
    }
  }

  countDiff(value: string) {
    const countDiff = Number(value);
    if (!isNaN(countDiff)) {
      this.internalInput.next({ countDiff });
    }
  }

  setColor(value: string) {
    if (value !== undefined) {
      this.internalInput.next({ color: value });
    }
  }
}
