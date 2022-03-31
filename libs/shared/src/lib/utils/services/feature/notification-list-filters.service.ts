import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IKeyValuePair } from '../../core/model/dictionary.model';
import { HttpHeaders } from '@angular/common/http';
import { AdminPanelApiService } from './admin-panel-api.service';
import { DeferredResource } from '../../snatch/utils/deferred-resource';
import { filter } from 'rxjs/operators';

export interface FilterParamList {
  text: string;
  value: string;
  selected?: boolean;
}

export interface FilterList {
  key: string;
  value: string[];
}

export interface ILabeledItem {
  id: string;
  value?: string;
}

export interface ListFilters {
  trigger: ILabeledItem[];
  venue: ILabeledItem[];
  recipient: ILabeledItem[];
}

@Injectable({
  providedIn: 'root',
})
export class NotificationListFiltersService {
  private readonly filterVenueList = [
    { text: 'Virtual Delivery', value: 'v-ilt' },
    { text: 'Classroom Delivery', value: 'ilt' },
  ];

  private readonly filterRecipientList = [
    { text: 'Learner', value: 'learner' },
    { text: 'Instructor', value: 'instructor' },
    { text: 'Training Manager', value: 'training-manager' },
  ];

  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  get filterVenues(): FilterParamList[] {
    return this.filterVenueList;
  }

  get filterRecipient(): FilterParamList[] {
    return this.filterRecipientList;
  }

  public getFilterObj(input: string[], key: string) {
    let obj;
    if (input && input.length > 0) {
      obj = {};
      obj[key] = input;
    } else {
      obj = null;
    }
    return obj;
  }

  public getFilterParamsObj(filterItem: FilterList[]) {
    return {
      venue: filterItem.find((x) => x.key === 'venue')?.value ?? [],
      recipient: filterItem.find((x) => x.key === 'recipient')?.value ?? [],
      trigger: filterItem.find((x) => x.key === 'trigger')?.value ?? [],
    };
  }

  public getTriggerFilters(): Observable<DeferredResource<IKeyValuePair[]>> {
    const url = this.adminPanelApiService.prepareURL(
      '/api/solar/configuration/query/dictionary?showKeys=true&@configType=course-notification-trigger',
    );
    const params = this.adminPanelApiService.prepareParams();
    return this.adminPanelApiService
      .get<IKeyValuePair[]>(url, new HttpHeaders({}), params)
      .pipe(filter((x) => x.isSuccess));
  }
}
