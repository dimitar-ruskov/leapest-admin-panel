import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DeferredResource} from "../../common";
import {EnvironmentService} from "./environment.service";
import DeferredResourceUtils from "../../common/deferred-resource.utils";
import {AmberResponse, IPageable} from "../../../models/interfaces";

@Injectable({
  providedIn: 'root',
})
export class AdminPanelApiService {
  constructor(private readonly environment: EnvironmentService, private readonly http: HttpClient) {}

  prepareURL(path): string {
    return `${this.environment.amberBaseUrl}${path}`;
  }

  prepareParams(pageable?: IPageable): HttpParams {
    let params = new HttpParams();

    if (pageable) {
      const { page, limit, filter, filterParams, sort } = pageable;

      if (page) {
        params = params.append('page', page.toString());
      }

      if (limit) {
        params = params.append('limit', limit.toString());
      }

      if (filter) {
        params = params.append('filter', filter.toString());
      }

      if (filterParams) {
        filterParams.forEach((filterParam) => {
          filterParam.value.forEach((value) => {
            params = params.append(filterParam.key, value);
          });
        });
      }

      if (sort) {
        params = params.append(`$${sort.key}`, sort.value === 'ascend' ? '1' : '-1');
      }
    }

    return params;
  }

  get<T>(url: string, headers: HttpHeaders, params: HttpParams): Observable<DeferredResource<T>> {
    return DeferredResourceUtils.wrapAmberObservable(
      this.http.get<AmberResponse<T>>(url, { headers, params }),
    );
  }

  getWithFlags<T>(
    url: string,
    headers: HttpHeaders,
    params: HttpParams,
  ): Observable<DeferredResource<{ data: T; flags: { size: number } }>> {
    return DeferredResourceUtils.wrapAmberObservableWithFlags(
      this.http.get<AmberResponse<{ data: T; flags: { size: number } }>>(url, { headers, params }),
    );
  }

  post<T, V>(url: string, headers: HttpHeaders, body: V, params = new HttpParams()): Observable<DeferredResource<T>> {
    return DeferredResourceUtils.wrapAmberObservable(
      this.http.post<AmberResponse<T>>(url, body, {
        headers,
        params,
      }),
    );
  }
}
