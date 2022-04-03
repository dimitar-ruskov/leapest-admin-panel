import { Observable, of } from 'rxjs';
import {ApolloError, ApolloQueryResult, FetchResult} from "@apollo/client/core";

import { DeferredResource } from './deferred-resource';
import { catchError, map, startWith } from 'rxjs/operators';
import {AmberResponse} from "../../models/interfaces";

namespace DeferredResourceUtils {
  export const wrapObservable = <T>(observable: Observable<ApolloQueryResult<T> | FetchResult<T>>): Observable<DeferredResource<T>> => {
    return observable.pipe(
      map(body => {
        if (body.errors) {
          throw new ApolloError({ graphQLErrors: body.errors });
        }
        return DeferredResource.success(body.data);
      }),
      catchError(err => of(DeferredResource.error<T>(err))),
      startWith(DeferredResource.pending<T>())
    );
  };

  export const wrapAmberObservable = <T>(observable: Observable<AmberResponse<T>>): Observable<DeferredResource<T>> => {
    return observable.pipe(
      map(body => DeferredResource.success(body.data)),
      catchError(err => of(DeferredResource.error<T>(err))),
      startWith(DeferredResource.pending<T>())
    );
  };

  export const wrapAmberObservableWithFlags = <T>(observable: Observable<AmberResponse<T>>): Observable<DeferredResource<T>> => {
    return observable.pipe(
      map(body => DeferredResource.success(<any>body)),
      catchError(err => of(DeferredResource.error<T>(err))),
      startWith(DeferredResource.pending<T>())
    );
  };
}

export default DeferredResourceUtils;
