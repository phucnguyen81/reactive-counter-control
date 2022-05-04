import { State, Input } from './counter.io';

/**
 * Computes next state from current state and latest input event.
 * @param state current state
 * @param event current event
 * @returns the next state
 */
export function reduceState(state: State, event: Input): State {
  const change: Partial<State> = {};  // the partial state change

  if (event.tick) {
    const sign = (state.countUp ? 1 : -1);
    change.count = (state.count + (sign * state.step));
  }
  else if (event.start && !state.active) {
    change.active = true;
  }
  else if (event.pause && state.active) {
    change.active = false;
  }
  else if (event.inputSetTo !== undefined) {
    change.inputSetTo = event.inputSetTo;
  }
  else if (event.saveSetTo !== undefined && state.inputSetTo !== undefined) {
    change.count = state.inputSetTo;
    change.saveSetTo = state.inputSetTo;
  }
  else if (event.countUp && !state.countUp) {
    change.countUp = true;
  }
  else if (event.countDown && state.countUp) {
    change.countUp = false;
  }
  else if (event.tickSpeed !== undefined) {
    change.speedInMs = event.tickSpeed;
  }
  else if (event.countDiff !== undefined) {
    change.step = event.countDiff;
  }
  else if (event.color !== undefined) {
    change.color = (event.color === state.color) ? '' : event.color;
  }
  else if (event.reset) {
    Object.assign(change, event.reset);
  }

  return Object.assign(new State(), state, change);
}
