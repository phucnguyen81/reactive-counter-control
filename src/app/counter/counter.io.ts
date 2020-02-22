export class Input {
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

export class State {
  count: number = 0;
  active: boolean = false;
  inputSetTo: number = 0;
  saveSetTo?: number;
  countUp: boolean = true;
  step: number = 1;
  speedInMs: number = 1000;
  color: string = '';
}

export function createState(partial: Partial<State>): State {
  return {...(new State()), ...partial};
}

export class View {
  digits: string[] = [];
  inputSetTo: number = 1;
  speed: number = 1000;
  step: number = 1;
  color: string = '';
}
