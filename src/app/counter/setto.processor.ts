import { Subject, Observable, OperatorFunction, merge, pipe } from 'rxjs';
import { scan, map } from 'rxjs/operators';

import { Processor } from './processor';
import { SetCount } from './counter.events';
import { CounterState } from './counter.state';
import { SetToInput, SetToOutput } from './setto.io';

export class SetToProcessor extends Processor<SetToInput, SetToOutput> {
  constructor(private readonly input$: Observable<SetToInput>) {
    super(
      input$,
      scan<SetToInput, SetToOutput>((output, input) => {
        const merged = {
          ...output,
          ...input
        };
        return {
          value: merged.value,
          saved: !!merged.save
        };
      }, new SetToOutput())
    );
  }

  update(value: number): void {
    this.send({value: value});
  }

  save(): void {
    this.send({save: true});
  }
}
