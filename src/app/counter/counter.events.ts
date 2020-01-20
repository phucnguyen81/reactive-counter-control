import { CounterInitialState } from './counter.state';

export interface CounterEvent {
  readonly type: string;
}
export class CounterError implements CounterEvent {
  readonly type = 'COUNTER_ERROR';
  constructor(readonly error: Error) {}
}
export class Init implements CounterEvent {
  readonly type = 'COUNTER_INIT';
  constructor(readonly initialState: CounterInitialState) {}
}
export class Reset implements CounterEvent {
  readonly type = 'COUNTER_RESET';
}
export class Tick implements CounterEvent {
  readonly type = 'COUNTER_TICK';
}
export class Start implements CounterEvent {
  readonly type = 'COUNTER_START';
}
export class Pause implements CounterEvent {
  readonly type = 'COUNTER_PAUSE';
}
export class CountUp implements CounterEvent {
  readonly type = 'COUNTER_COUNT_UP';
}
export class CountDown implements CounterEvent {
  readonly type = 'COUNTER_COUNT_DOWN';
}
export class TickSpeed implements CounterEvent {
  readonly type = 'COUNTER_TICK_SPEED';
  constructor(readonly tickSpeed: number) {}
}
export class CountDiff implements CounterEvent {
  readonly type = 'COUNTER_COUNT_DIFF';
  constructor(readonly countDiff: number) {}
}
export class SetCount implements CounterEvent {
  readonly type = 'COUNTER_SET_COUNT';
  constructor(readonly count: number) {}
}
export class Color implements CounterEvent {
  readonly type = 'COUNTER_COLOR';
  constructor(readonly color: string) {}
}
