export class CounterInitialState {
  count: number;
  setTo: number;
  running: boolean;
  up: boolean;
  step: number;
  speed: number;
  color: string;
}

export class CounterState extends CounterInitialState {
  initialState?: CounterInitialState;
}

export const DEFAULT_INITIAL_STATE: CounterInitialState = {
  count: 0,
  setTo: 1,
  running: false,
  up: true,
  step: 1,
  speed: 1000,  // in miliseconds
  color: '',
};

