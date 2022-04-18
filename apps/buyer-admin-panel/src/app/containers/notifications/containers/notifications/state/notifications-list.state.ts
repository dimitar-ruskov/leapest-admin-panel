import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";
import { filter, tap } from "rxjs/operators";

import {
  NotificationsService
} from "../../../../../../../../../libs/shared/src/lib/services/notifications/notifications.service";
import { ChangePage, ClearSearchForm, FetchNotifications, ToggleSort } from "./notifications-list.actions";

import { DeferredResource } from "../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  IPageable,
  ISearchMetadata,
  ISearchParams,
  NotificationModel,
  Sort
} from "../../../../../../../../../libs/shared/src/lib/models";


export class NotificationsListStateModel {
  notifications: DeferredResource<NotificationModel[]>;
  searchMetadata: ISearchMetadata;
  pagination: IPageable;
  sort: Sort;
  searchForm: {
    model: ISearchParams;
    dirty: boolean;
    status: string;
    errors: any;
  };
}

@State<NotificationsListStateModel>({
  name: 'notificationsList',
  defaults: {
    notifications: undefined,
    searchMetadata: undefined,
    pagination: { limit: 10, page: 1 },
    sort: {},
    searchForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    },
  },
})
@Injectable()
export class NotificationsListState {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Action(ToggleSort)
  toggleSort({ patchState, getState }: StateContext<NotificationsListStateModel>, action: ToggleSort) {
    if (!action.key) {
      patchState({ sort: { key: undefined, order: undefined } });
    } else {
      patchState({ ...getState(), sort: { key: action.key, order: action.direction } });
    }
  }

  @Action(ChangePage)
  changePage({ patchState, getState }: StateContext<NotificationsListStateModel>, action: ChangePage) {
    patchState({ pagination: { ...getState().pagination, page: action.payload } });
  }

  @Action(FetchNotifications)
  fetchNotifications({ getState, patchState }: StateContext<NotificationsListStateModel>, action: FetchNotifications) {
    const { searchForm, pagination, sort } = getState();
    const filters = searchForm.model;

    return this.notificationsService.fetchNotifications(filters, sort, pagination).pipe(
      filter((x) => x.isSuccess),
      tap((data: DeferredResource<{ data: NotificationModel[]; count: number }>) => {
        const result = data.unwrap((res) => res.data);
        patchState({
          notifications: result,
          searchMetadata: { totalCount: data.response?.count ?? 0 },
        });
      }),
    );
  }

  @Action(ClearSearchForm)
  clearSearchForm({ patchState }: StateContext<NotificationsListStateModel>) {
    patchState({
      searchForm: {
        model: undefined,
        dirty: false,
        status: '',
        errors: {},
      },
    });
  }
}
