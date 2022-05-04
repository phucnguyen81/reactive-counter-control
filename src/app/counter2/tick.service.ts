import * as rx from 'rxjs';
import * as op from 'rxjs/operators';

/**
 * Timer service.
 */
export class TickService {

  private tickInput$ = new rx.Subject<number>();

  tick$ = this.tickInput$.pipe(
    op.switchMap(speedInMs => {
      return (speedInMs > 0) ? rx.interval(speedInMs): rx.EMPTY;
    }),
    op.mapTo(1)
  );

  start(speedInMs?: number): void {
    if (speedInMs !== undefined && speedInMs > 0) {
      this.tickInput$.next(speedInMs);
    }
  }

  stop(): void {
    this.tickInput$.next(0);
  }

}
