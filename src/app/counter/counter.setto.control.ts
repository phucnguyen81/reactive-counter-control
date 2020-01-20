import { Observable } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';

import { CounterState } from './counter.state';
import { SetCount } from './counter.events';
import { SetToControl, SetToOutput } from './setto.control';

export class CounterSetToControl {
  private readonly input$ = this.counterState$.pipe(
    map<CounterState, number>(state => state.setTo),
    distinctUntilChanged(),
  );

  private readonly setToControl = new SetToControl(this.input$);

  private readonly setToOutput$: Observable<SetToOutput> =
    this.setToControl.output$;

  value$: Observable<number> = this.setToOutput$.pipe(
    map(output => output.value)
  );

  output$: Observable<SetCount> = this.setToOutput$.pipe(
    filter<SetToOutput>(output => output.saved),
    map<SetToOutput, SetCount>(output => {
      return new SetCount(output.value);
    })
  );

  constructor(
    private readonly counterState$: Observable<CounterState>
  ) { }

  update(value: number): void {
    this.setToControl.update(value);
  }

  save(): void {
    this.setToControl.save();
  }
}
