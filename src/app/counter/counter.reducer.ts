import {
  CounterEvent, CounterInitialState, CounterState,
  DEFAULT_INITIAL_STATE
} from './counter.io';

/**
 * Pure function that computes next state given current
 * state and latest event.
 */
export function nextState(
  state: CounterState, event: CounterEvent
): CounterState {
  if (event.tick) {
    const diff = state.step * (state.up ? 1 : -1);
    state = {...state, count: state.count + diff};
  }
  if (event.init) {
    const initState = event.init;
    state = {
      ...state,
      ...initState,
      initialState: {...initState}
    };
  }
  if (event.start) {
    state = {...state, running: true};
  }
  if (event.pause) {
    state = {...state, running: false};
  }
  if (event.reset) {
    state = {...state, ...state.initialState};
  }
  if (event.countUp) {
    state = {...state, up: true};
  }
  if (event.countDown) {
    state = {...state, up: false};
  }
  if (event.tickSpeed !== undefined) {
    state = {...state, speed: event.tickSpeed}
  }
  if (event.countDiff !== undefined) {
    state = {...state, step: event.countDiff}
  }
  if (event.setCount !== undefined) {
    state = {...state, count: event.setCount, setTo: event.setCount};
  }
  if (event.color !== undefined) {
    state = {...state, color: event.color};
  }
  return state;
}
