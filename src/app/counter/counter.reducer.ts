import {
  CounterInitialState, CounterState, DEFAULT_INITIAL_STATE
} from './counter.state';

import {
  CounterEvent, Init, Start, Pause, Reset,
  CountUp, CountDown, TickSpeed, CountDiff,
  Color, SetCount, Tick
} from './counter.events';

/**
 * Pure function (no side effects) that computes next state given
 * current state and latest event.
 */
export function nextState(
  state: CounterState, event: CounterEvent
): CounterState {
  if (event instanceof Tick) {
    const diff = state.step * (state.up ? 1 : -1);
    return {...state, count: state.count + diff};
  }
  if (event instanceof Init) {
    const initState = event.initialState;
    return {
      ...state,
      ...initState,
      initialState: {...initState}
    };
  }
  if (event instanceof Start) {
    return {...state, running: true};
  }
  if (event instanceof Pause) {
    return {...state, running: false};
  }
  if (event instanceof Reset) {
    return {...state, ...state.initialState};
  }
  if (event instanceof CountUp) {
    return {...state, up: true};
  }
  if (event instanceof CountDown) {
    return {...state, up: false};
  }
  if (event instanceof TickSpeed) {
    return {...state, speed: event.tickSpeed}
  }
  if (event instanceof CountDiff) {
    return {...state, step: event.countDiff}
  }
  if (event instanceof SetCount) {
    const count = event.count;
    return {...state, count: count, setTo: count};
  }
  if (event instanceof Color) {
    return {...state, color: event.color};
  }
  return state;
}
