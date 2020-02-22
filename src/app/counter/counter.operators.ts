import * as rx from 'rxjs';
import * as op from 'rxjs/operators';

export function mapNumber(): rx.OperatorFunction<any, number> {
  return function(input$: rx.Observable<any>): rx.Observable<number> {
    return input$.pipe(
      op.map(input => Number(input)),
      op.filter(num => (!isNaN(num))),
    );
  }
}

