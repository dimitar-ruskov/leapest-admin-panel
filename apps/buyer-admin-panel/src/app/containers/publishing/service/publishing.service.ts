import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

import {AdminPanelApiService} from "../../../../../../../libs/shared/src/lib/utils/services/common";
import {DeferredResource} from "../../../../../../../libs/shared/src/lib/utils/common";
import {
  IPublishingSettings
} from "../../../../../../../libs/shared/src/lib/models/interfaces/publishing/publishing.model";

@Injectable({
  providedIn: 'root',
})
export class PublishingService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  getDetails(type: string): Observable<DeferredResource<IPublishingSettings>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/partner/lxp/settings/internal-repository/details/by-type/${type}`,
    );
    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<IPublishingSettings>(url, new HttpHeaders({}), params);
  }

  editPublishingSettings(data: IPublishingSettings): Observable<DeferredResource<IPublishingSettings>> {
    const url = this.adminPanelApiService.prepareURL('/api/partner/lxp/settings/internal-repository/create-or-update');

    return this.adminPanelApiService.post<IPublishingSettings, IPublishingSettings>(url, new HttpHeaders({}), data);
  }
}
