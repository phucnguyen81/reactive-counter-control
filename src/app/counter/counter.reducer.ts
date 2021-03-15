import { State, Input } from './counter.io';

export function reduceState(state: State, event: Input): State {
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
    return {...state,
      color: (event.color === state.color) ? '' : event.color
    };
  }
  return state;
}
