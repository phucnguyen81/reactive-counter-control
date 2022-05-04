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

export function createState(...partials: Partial<State>[]): State {
  return Object.assign(new State(), ...partials);
}

export class View {
  digits: string[] = [];
  inputSetTo: number = 1;
  speed: number = 1000;
  step: number = 1;
  color: string = '';
}
