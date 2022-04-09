import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as moment from 'moment';
import 'moment-timezone';
import {EnvironmentService} from "./environment.service";
import {IKeyValuePair, IProfile} from "../../../models/interfaces";
import {DeferredResource} from "../../common";
import DeferredResourceUtils from "../../common/deferred-resource.utils";

@Injectable({
  providedIn: 'root',
})
export class TimezoneService {
  constructor(
    private readonly modalService: NzModalService,
    private readonly store: Store,
    private readonly http: HttpClient,
    private readonly environment: EnvironmentService,
  ) {}

  getTimezoneDictionary(): Observable<DeferredResource<IKeyValuePair[]>> {
    const url = `${this.environment.amberUrl}/solar/system/datetime/timezones`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'skip-auth-interceptor': 'true',
    });

    return DeferredResourceUtils.wrapAmberObservable(
      this.http.get<any>(url, { headers }),
    );
  }

  setTimezone(timezone: string): Observable<{ data: IProfile }> {
    const url = `${this.environment.amberBaseUrl}/domain/api/solar/branded/profile/update`;
    return this.http.post<{ data: IProfile }>(url, { timeZone: timezone });
  }

  detectTimezone(timezones: { key: string; offset: number }[]): string | null {
    const offset = new Date().getTimezoneOffset();
    const match = timezones.find((t) => t.offset === offset);
    return match ? match.key : null;
  }

  getBrowserTimezone(): string {
    return moment.tz.guess();
  }
}
