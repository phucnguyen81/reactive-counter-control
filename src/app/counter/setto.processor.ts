import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

import { Processor } from './processor';
import { SetToInput, SetToOutput } from './setto.io';

export class SetToProcessor extends Processor<SetToInput, SetToOutput> {
  constructor(private readonly setToInput$: Observable<SetToInput>) {
    super(
      setToInput$,
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
