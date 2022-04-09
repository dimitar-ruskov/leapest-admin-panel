import { Action, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import { IltCourseNotificationsService } from '../../../../../services/ilt-course-notifications.service';
import {
  FetchCourseDetailsILTNotifications,
  GetNotificationDetails,
  ClearNotificationDetailsPartial,
  TestEmail,
  ToggleSort,
  ResetNotificationTemplate,
  UpdateNotificationTemplate,
  PreviewNotificationTemplate,
  ClearNotificationDetails,
  ChangePage,
  GetReportingManagerMapping,
  ClearSearchForm,
} from './ilt-course-details-notifications.actions';
import {DeferredResource} from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  NotificationModel,
  ReportingDomainsMap
} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces/notifications/notifications.model";
import {NotificationListFiltersService} from "../../../../../../../../../../../libs/shared/src/lib/utils/services";
import {IPageable, Sort} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces";

export interface ISearchParams {
  filter?: string;
  recipient?: string[];
  trigger?: string[];
  venue?: string[];
}

export interface ISearchMetadata {
  totalCount: number;
}

export class IltCourseDetailsNotificationsStateModel {
  notifications: DeferredResource<NotificationModel[]>;
  searchMetadata: ISearchMetadata;
  pagination: IPageable;
  searchForm: {
    model: ISearchParams;
    dirty: boolean;
    status: string;
    errors: any;
  };

  sort: Sort;

  details: DeferredResource<NotificationModel>;
  updateTemplate: DeferredResource<NotificationModel>;
  resetTemplate: DeferredResource<NotificationModel>;
  testEmail: DeferredResource<string>;
  previewTemplate: DeferredResource<string>;
  reportingManagerMapping: DeferredResource<ReportingDomainsMap[]>;
}

const defaults = {
  notifications: undefined,
  searchMetadata: undefined,
  pagination: { limit: 10, page: 1 },
  searchForm: {
    model: undefined,
    dirty: false,
    status: '',
    errors: {},
  },
  sort: {},

  updateTemplate: undefined,
  resetTemplate: undefined,
  testEmail: undefined,
  previewTemplate: undefined,
  details: undefined,
  reportingManagerMapping: undefined,
};

@State<IltCourseDetailsNotificationsStateModel>({
  name: 'iltCourseDetailsNotifications',
  defaults,
})
@Injectable()
export class IltCourseDetailsNotificationsState {
  constructor(
    private readonly store: Store,
    private readonly service: IltCourseNotificationsService,
    private readonly notificationsFilters: NotificationListFiltersService,
  ) {}

  @Action(FetchCourseDetailsILTNotifications)
  fetchNotifications(
    { getState, patchState }: StateContext<IltCourseDetailsNotificationsStateModel>,
    action: FetchCourseDetailsILTNotifications,
  ) {
    const courseId = action.id || this.store.snapshot().iltCourseDetails.iltCourse.id;

    const { searchForm, pagination, sort } = getState();

    const filters = searchForm.model;

    return this.service.list(courseId, filters, sort, pagination).pipe(
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

  @Action(ToggleSort)
  toggleSort({ patchState, getState }: StateContext<IltCourseDetailsNotificationsStateModel>, action: ToggleSort) {
    if (!action.key) {
      patchState({ sort: { key: undefined, order: undefined } });
    } else {
      patchState({ ...getState(), sort: { key: action.key, order: action.direction } });
    }
  }

  @Action(ChangePage)
  changePage({ patchState, getState }: StateContext<IltCourseDetailsNotificationsStateModel>, action: ChangePage) {
    patchState({ pagination: { ...getState().pagination, page: action.payload } });
  }

  @Action(GetNotificationDetails)
  getNotificationDetails(
    { patchState }: StateContext<IltCourseDetailsNotificationsStateModel>,
    action: GetNotificationDetails,
  ) {
    return this.service.details(action.courseId, action.trigger, action.recipient, action.venue).pipe(
      tap((data: DeferredResource<NotificationModel>) => {
        patchState({ details: data });
      }),
    );
  }

  @Action(ResetNotificationTemplate)
  resetNotificationTemplate(
    { patchState, dispatch }: StateContext<IltCourseDetailsNotificationsStateModel>,
    action: ResetNotificationTemplate,
  ) {
    const data = {
      trigger: {
        configKey: action.trigger,
      },
      recipient: {
        configKey: action.recipient,
      },
      venue: {
        configKey: action.venue,
      },
    };

    return this.service.reset(action.courseId, data, action.level).pipe(
      tap((resp: DeferredResource<NotificationModel>) => {
        patchState({ resetTemplate: resp });
        if (resp.isSuccess) {
          dispatch(new GetNotificationDetails(action.courseId, action.trigger, action.recipient, action.venue));
        }
      }),
    );
  }

  @Action(TestEmail)
  testEmail({ patchState }: StateContext<IltCourseDetailsNotificationsStateModel>, action: TestEmail) {
    const data = {
      trigger: {
        configKey: action.trigger,
      },
      recipient: {
        configKey: action.recipient,
      },
      venue: {
        configKey: action.venue,
      },
    };

    return this.service.testEmail(action.courseId, data).pipe(
      tap((resp: DeferredResource<string>) => {
        patchState({ testEmail: resp });
      }),
    );
  }

  @Action(UpdateNotificationTemplate)
  updateNotificationTemplate(
    { patchState }: StateContext<IltCourseDetailsNotificationsStateModel>,
    action: UpdateNotificationTemplate,
  ) {
    return this.service.edit(action.courseId, action.data).pipe(
      tap((data: DeferredResource<NotificationModel>) => {
        patchState({ updateTemplate: data });
      }),
    );
  }

  @Action(PreviewNotificationTemplate)
  previewNotificationTemplate(
    { patchState }: StateContext<IltCourseDetailsNotificationsStateModel>,
    action: PreviewNotificationTemplate,
  ) {
    return this.service.preview(action.courseId, action.data).pipe(
      tap((data: DeferredResource<string>) => {
        patchState({ previewTemplate: data });
      }),
    );
  }

  @Action(ClearNotificationDetailsPartial)
  clearNotificationDetailsPartial({ patchState }: StateContext<IltCourseDetailsNotificationsStateModel>) {
    patchState({
      testEmail: undefined,
      resetTemplate: undefined,
    });
  }

  @Action(ClearNotificationDetails)
  clearNotificationDetails({ patchState }: StateContext<IltCourseDetailsNotificationsStateModel>) {
    patchState(defaults);
  }

  @Action(GetReportingManagerMapping)
  getReportingManagerMapping({ patchState }: StateContext<IltCourseDetailsNotificationsStateModel>) {
    return this.service.getReportingManagerMapping().pipe(
      tap((data: DeferredResource<ReportingDomainsMap[]>) => {
        patchState({ reportingManagerMapping: data });
      }),
    );
  }

  @Action(ClearSearchForm)
  clearSearchForm({ patchState }: StateContext<IltCourseDetailsNotificationsStateModel>) {
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
