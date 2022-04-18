import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { DeferredResource } from "../../utils/common";
import { AdminPanelApiService } from "../common/admin-panel-api.service";

@Injectable({
  providedIn: 'root',
})
export class TemplateComposerService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  getPlaceholderTooltips(): Observable<DeferredResource<Map<string, string>>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/domain-notification/tooltips');
    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<Map<string, string>>(url, new HttpHeaders({}), params);
  }
}
