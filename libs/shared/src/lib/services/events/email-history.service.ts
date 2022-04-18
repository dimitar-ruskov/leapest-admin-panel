import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  EmailNotification,
  IPageableEmailHistory,
} from '../../models/notifications/email-history.model';

import {AdminPanelApiService} from "../common";
import {DeferredResource} from "../../utils/common";

@Injectable({
  providedIn: 'root',
})
export class EmailHistoryService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  getEmailHistory(
    eventId: string,
    pageable?: IPageableEmailHistory,
  ): Observable<
    DeferredResource<{
      data: {
        data: EmailNotification[];
        count: number;
      };
    }>
  > {
    const url = this.adminPanelApiService.prepareURL(`/api/course-notification/event/list/emails/${eventId}`);
    let params = this.adminPanelApiService.prepareParams(pageable);
    params = params.append('venue', pageable.venue);
    params = params.append('trigger', pageable.trigger);
    params = params.append('recipient', pageable.recipient);

    return this.adminPanelApiService.getWithFlags<{ data: EmailNotification[]; count: number }>(
      url,
      new HttpHeaders({}),
      params,
    );
  }

  resendEmail(hedwigEmailId: string): Observable<DeferredResource<{ data: string; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(`/api/course-notification/email/resend/${hedwigEmailId}`);
    return this.adminPanelApiService.post<{ data: string; flags: { size: number } }, null>(
      url,
      new HttpHeaders({}),
      null,
    );
  }

  preview(hedwigEmailId: string): Observable<DeferredResource<{ data: string; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(`/api/course-notification/email/preview/${hedwigEmailId}`);
    const params = this.adminPanelApiService.prepareParams();
    return this.adminPanelApiService.getWithFlags<string>(url, new HttpHeaders({}), params);
  }
}
