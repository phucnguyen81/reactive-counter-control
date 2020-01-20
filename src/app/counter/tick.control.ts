import { Observable, OperatorFunction, interval, EMPTY } from 'rxjs';
import { switchMap, distinctUntilChanged, mapTo } from 'rxjs/operators';

export class TickInput {
  constructor(readonly active: boolean, readonly speed: number) {}

  isEqual(other: TickInput): boolean {
    return (
      this.active === other.active
      && this.speed === other.speed
    );
  }
}

export class TickOutput {}

export class TickControl {
  readonly output$: Observable<TickOutput> = this.input$.pipe(
    distinctUntilChanged(
      (prevInput: TickInput, input: TickInput) => {
        return input.isEqual(prevInput);
      }
    ),
    switchMap(input => {
      return (input.active ? interval(input.speed): EMPTY);
    }),
    mapTo(new TickOutput()),
  );

  constructor(private readonly input$: Observable<TickInput>) { }
}
