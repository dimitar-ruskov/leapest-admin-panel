import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { EmailHistoryService } from '../../../../../../../services/email-history.service';
import {
  ChangeEmailHistoryPaginationParams,
  GetEmailHistory,
  PreviewNotificationHistoryTemplate
} from "./email-history.action";

import { EmailNotification, IPageableEmailHistory } from '../../../../../../../../../../../../../libs/shared/src/lib/models/interfaces/notifications/email-history.model';
import {DeferredResource} from "../../../../../../../../../../../../../libs/shared/src/lib/utils/common";


const DEFAULT_INITIAL_PAGINATION_PARAMS: IPageableEmailHistory = {
  limit: 10,
  page: 1,
  filter: '',
  filterParams: [],
  sort: null,
  venue: '',
  trigger: '',
  recipient: '',
};

export class EmailHistoryStateModel {
  mailList: EmailNotification[];
  loading: boolean;
  total: number;
  paginationParams: IPageableEmailHistory;
  previewTemplate: DeferredResource<void>;
}

@State<EmailHistoryStateModel>({
  name: 'emailHistory',
  defaults: {
    mailList: [],
    loading: false,
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    previewTemplate: undefined,
  },
})
@Injectable()
export class EmailHistoryState {
  @Selector([EmailHistoryState])
  static loading(state: EmailHistoryStateModel): boolean {
    return state.loading;
  }

  @Selector([EmailHistoryState])
  static mailList(state: EmailHistoryStateModel): EmailNotification[] {
    return state.mailList;
  }

  @Selector([EmailHistoryState])
  static total(state: EmailHistoryStateModel): number {
    return state.total;
  }

  @Selector([EmailHistoryState])
  static previewTemplate(state: EmailHistoryStateModel) {
    return state.previewTemplate;
  }

  @Selector([EmailHistoryState])
  static searchPhrase(state: EmailHistoryStateModel): string {
    return state.paginationParams.filter;
  }

  @Selector([EmailHistoryState])
  static pageIndex(state: EmailHistoryStateModel): number {
    return state.paginationParams.page;
  }

  @Selector([EmailHistoryState])
  static pageSize(state: EmailHistoryStateModel) {
    return state.paginationParams.limit;
  }

  constructor(private readonly service: EmailHistoryService) {}

  @Action(GetEmailHistory)
  getEmailHistory({ patchState, getState }: StateContext<EmailHistoryStateModel>, { payload }: GetEmailHistory) {
    const { paginationParams } = getState();
    const { classEventId } = payload;
    return this.service.getEmailHistory(classEventId, paginationParams).pipe(
      tap(
        (
          resource: DeferredResource<{
            data: {
              data: EmailNotification[];
              count: number;
            };
          }>,
        ) => {
          patchState({ loading: resource.isPending });

          if (resource.isSuccess) {
            patchState({ mailList: resource.response.data.data, total: resource.response.data.count });
          }
        },
      ),
    );
  }

  @Action(ChangeEmailHistoryPaginationParams)
  changeEmailHistoryPaginationParams(
    { patchState, getState }: StateContext<EmailHistoryStateModel>,
    { payload }: ChangeEmailHistoryPaginationParams,
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(PreviewNotificationHistoryTemplate)
  previewNotificationHistoryTemplate(
    { patchState }: StateContext<EmailHistoryStateModel>,
    action: PreviewNotificationHistoryTemplate,
  ) {
    return this.service.preview(action.hedwigEmailId).pipe(
      tap((resource: DeferredResource<any>) => {
        patchState({ previewTemplate: resource });
      }),
    );
  }
}
