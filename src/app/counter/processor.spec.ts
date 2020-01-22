import { Observable, Subject, EMPTY } from 'rxjs';
import { map, tap, takeUntil, toArray } from 'rxjs/operators';

import { Processor } from './processor';

describe('Processor', () => {
  it('should process input data', (done) => {
    const alwaysOne = new Processor<boolean, number>(
      EMPTY, map(val => val ? 1 : 0)
    );

    alwaysOne.pipe(
      toArray(),
      tap(vals => {
        expect(vals).toEqual([1, 0]);
        done();
      }),
    ).subscribe();

    alwaysOne.send(true);
    alwaysOne.send(false);
    alwaysOne.complete();
  });
});
