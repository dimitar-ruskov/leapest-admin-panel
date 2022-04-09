import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable } from 'rxjs';
import { debounceTime, map, shareReplay } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table/src/table.types';

import { ChangePage, FetchNotifications, ToggleSort, ClearSearchForm } from '../../state/notifications-list.actions';
import { PreviewNotificationTemplate } from '../../../notification-details/state/notification-details.action';
import {IGlobalStateModel} from "../../../../../../state/state.model";
import {ISearchMetadata, ISearchParams} from "../../state/notifications-list.state";

import {
  NotificationPreviewModalComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/modals/notification-preview-modal/notification-preview-modal.component";
import {DeferredResource} from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  FilterParamList,
  ListFilters,
  NotificationListFiltersService
} from "../../../../../../../../../../libs/shared/src/lib/utils/services";
import {
  ILabeledItem,
  NotificationModel, NotificationPayloadModel
} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces/notifications/notifications.model";
import {IPageable, Sort} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";

@Component({
  selector: 'leap-notifications-listing',
  templateUrl: './notifications-listing.component.html',
  styleUrls: ['./notifications-listing.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class NotificationsListingComponent implements OnInit, OnDestroy {
  @Select((state: IGlobalStateModel) => state.notifications['notificationsList'].notifications)
  notifications$: Observable<DeferredResource<NotificationModel[]>>;

  @Select((state: IGlobalStateModel) => state.notifications['notificationsList'].sort)
  sort$: Observable<Sort>;

  @Select((state: IGlobalStateModel) => state.notifications['notificationsList'].pagination)
  pagination$: Observable<IPageable>;

  @Select((state: IGlobalStateModel) => state.notifications['notificationsList'].searchForm)
  searchForm$: Observable<{ model: ISearchParams }>;

  @Select((state: IGlobalStateModel) => state.notifications['notificationsList'].searchMetadata)
  searchMetadata$: Observable<ISearchMetadata>;

  @Select((state: IGlobalStateModel) => state.notifications['notificationDetails'].previewTemplate)
  previewTemplate$: Observable<DeferredResource<string>>;

  selectedFilters$: Observable<ListFilters>;
  form: FormGroup;
  filterVenues: FilterParamList[] = this.notificationService.filterVenues;
  filterRecipient: FilterParamList[] = this.notificationService.filterRecipient;
  filterTrigger: FilterParamList[] = [];

  triggerFilterVisible = false;
  venueFilterVisible = false;
  recipientFilterVisible = false;

  trackByFn: TrackByFunction<NotificationModel> = (index, item) => item.id;

  constructor(
    private readonly router: Router,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly modalService: NzModalService,
    private readonly notificationService: NotificationListFiltersService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      filter: [null],
      trigger: [[]],
      venue: [[]],
      recipient: [[]],
    });

    this.notificationService
      .getTriggerFilters()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.filterTrigger = [
          ...data.response.map(
            (_) =>
              ({
                text: _.value,
                value: _.key,
                selected: false,
              } as FilterParamList),
          ),
        ];
      });

    merge(this.sort$, this.pagination$, this.searchForm$)
      .pipe(debounceTime(500), untilDestroyed(this))
      .subscribe(() => {
        this.fetchNotifications();
      });
  }

  ngOnDestroy() {
    this.clearForm();
    this.store.dispatch(new ClearSearchForm());
  }

  public filterPillsUpdated(change: Partial<ISearchParams>): void {
    this.patchForm(change);
    if (change.trigger) {
      this.updateFilterData(this.filterTrigger, change.trigger);
    }
    if (change.venue) {
      this.updateFilterData(this.filterVenues, change.venue);
    }
    if (change.recipient) {
      this.updateFilterData(this.filterRecipient, change.recipient);
    }
  }

  private patchForm(change: Partial<ISearchParams>): void {
    this.form.patchValue(change);
  }

  public clearForm(): void {
    this.form.reset({
      filter: null,
      trigger: [],
      venue: [],
      recipient: [],
    });
    this.updateFilterData(this.filterTrigger, []);
    this.updateFilterData(this.filterVenues, []);
    this.updateFilterData(this.filterRecipient, []);
  }

  onSearch(searchPhrase: string): void {
    this.patchForm({ filter: searchPhrase });
  }

  toggleSort(column?: string, direction?: number): void {
    this.store.dispatch(new ToggleSort(column, direction));
  }

  onPageChange(page: number): void {
    this.store.dispatch(new ChangePage(page));
  }

  onQueryParamsChange(event: NzTableQueryParams): void {
    const column = event.sort.find((_) => _.value !== null);
    this.onPageChange(event.pageIndex);
    this.toggleSort(column?.key, column?.value === 'ascend' ? 1 : column?.value === 'descend' ? -1 : null);
  }

  public setFilters(): void {
    this.triggerFilterVisible = false;
    this.venueFilterVisible = false;
    this.recipientFilterVisible = false;
    this.updateFilters();
  }

  private updateFilters(): void {
    this.patchForm({
      trigger: this.filterTrigger.filter((x) => x.selected).map((x) => x.value),
      venue: this.filterVenues.filter((x) => x.selected).map((x) => x.value),
      recipient: this.filterRecipient.filter((x) => x.selected).map((x) => x.value),
    });
  }

  openPreviewTemplate(payload: NotificationModel, event: MouseEvent): void {
    event.stopPropagation();
    const data: NotificationPayloadModel = {
      subject: payload.subject,
      emailMarkup: payload.emailMarkup,
      trigger: { configKey: payload.trigger.configKey },
      recipient: { configKey: payload.recipient.configKey },
      venue: payload.venue ? { configKey: payload.venue.configKey } : null,
    };

    this.store.dispatch(new PreviewNotificationTemplate(data));

    const modal = this.modalService.create({
      nzTitle: 'Email Template Preview',
      nzWidth: '660px',
      nzContent: NotificationPreviewModalComponent,
      nzWrapClassName: 'modal-class',
      nzComponentParams: {
        previewTemplate$: this.previewTemplate$,
      },
      nzFooter: [
        {
          label: 'Close Preview',
          type: 'default',
          onClick: () => modal.destroy(),
        },
      ],
    });
  }

  private fetchNotifications(): void {
    this.store.dispatch(new FetchNotifications());
    this.selectedFilters$ = this.searchForm$.pipe(
      untilDestroyed(this),
      map(({ model }) => {
        return {
          trigger: model.trigger.map((x) => ({
            id: x,
            value: this.filterTrigger.find((el) => el.value === x).text,
          })) as ILabeledItem[],
          venue: model.venue.map((x) => ({
            id: x,
            value: this.filterVenues.find((el) => el.value === x).text,
          })) as ILabeledItem[],
          recipient: model.recipient.map((x) => ({
            id: x,
            value: this.filterRecipient.find((el) => el.value === x).text,
          })) as ILabeledItem[],
        } as ListFilters;
      }),
      shareReplay(),
    );
  }

  private updateFilterData(arr: FilterParamList[], changeArr: string[]): void {
    arr.forEach((x) => {
      x.selected = changeArr.includes(x.value);
    });
  }
}
