import { Observable, interval, EMPTY, pipe } from 'rxjs';
import { switchMap, distinctUntilChanged, mapTo } from 'rxjs/operators';

import { Processor } from './processor';
import { TickInput, TickOutput } from './tick.io';

export class TickProcessor extends Processor<TickInput, TickOutput> {
  constructor(tickInput$: Observable<TickInput>) {
    super(
      pipe(
        distinctUntilChanged(
          (prevInput: TickInput, input: TickInput) => {
            return input.isEqual(prevInput);
          }
        ),
        switchMap(input => {
          return (input.active ? interval(input.speed): EMPTY);
        }),
        mapTo(new TickOutput()),
      )
    );

    this.receive(tickInput$);
  }
}
