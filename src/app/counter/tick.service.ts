import { Injectable } from '@angular/core';

import * as rx from 'rxjs';
import * as op from 'rxjs/operators';

/**
 * Timer service.
 */
@Injectable()
export class TickService {

  private readonly tickInput$ = new rx.Subject<number>();

  readonly tick$ = this.tickInput$.pipe(
    op.switchMap(speedInMs => {
      return (speedInMs > 0) ? rx.interval(speedInMs): rx.EMPTY;
    }),
    op.mapTo(1),
    op.share(),
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
