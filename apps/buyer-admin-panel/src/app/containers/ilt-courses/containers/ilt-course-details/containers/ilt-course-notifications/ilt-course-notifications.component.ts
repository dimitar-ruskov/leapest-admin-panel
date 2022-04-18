import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TrackByFunction } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Select, Store } from "@ngxs/store";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { merge, Observable } from "rxjs";
import { debounceTime, map, shareReplay } from "rxjs/operators";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzTableQueryParams } from "ng-zorro-antd/table/src/table.types";

import {
  ChangePage,
  ClearSearchForm,
  FetchCourseDetailsILTNotifications,
  PreviewNotificationTemplate,
  ToggleSort
} from "./state/ilt-course-details-notifications.actions";
import { IGlobalStateModel } from "../../../../../../state/state.model";

import {
  NotificationPreviewModalComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/modals/notification-preview-modal/notification-preview-modal.component";
import { DeferredResource } from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  FilterParamList,
  ILabeledItem,
  IPageable,
  ISearchMetadata,
  ISearchParams,
  ListFilters,
  NotificationModel,
  NotificationPayloadModel,
  Sort
} from "../../../../../../../../../../libs/shared/src/lib/models";
import {
  NotificationListFiltersService
} from "../../../../../../../../../../libs/shared/src/lib/services/notifications/notification-list-filters.service";


@Component({
  selector: 'leap-ilt-course-notifications',
  templateUrl: './ilt-course-notifications.component.html',
  styleUrls: ['./ilt-course-notifications.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltCourseNotificationsComponent implements OnInit, OnDestroy {
  @Select((state: IGlobalStateModel) => state.iltCourses.iltCourseDetails['iltCourseDetailsNotifications'].notifications)
  notifications$: Observable<DeferredResource<NotificationModel[]>>;

  @Select((state: IGlobalStateModel) => state.iltCourses.iltCourseDetails['iltCourseDetailsNotifications'].sort)
  sort$: Observable<Sort>;

  @Select((state: IGlobalStateModel) => state.iltCourses.iltCourseDetails['iltCourseDetailsNotifications'].pagination)
  pagination$: Observable<IPageable>;

  @Select((state: IGlobalStateModel) => state.iltCourses.iltCourseDetails['iltCourseDetailsNotifications'].searchForm)
  searchForm$: Observable<{ model: ISearchParams }>;

  @Select((state: IGlobalStateModel) => state.iltCourses.iltCourseDetails['iltCourseDetailsNotifications'].previewTemplate)
  previewTemplate$: Observable<DeferredResource<string>>;

  @Select((state: IGlobalStateModel) => state.iltCourses.iltCourseDetails['iltCourseDetailsNotifications'].searchMetadata)
  searchMetadata$: Observable<ISearchMetadata>;

  filterVenues: FilterParamList[] = this.notificationService.filterVenues;
  filterRecipient: FilterParamList[] = this.notificationService.filterRecipient;
  filterTrigger: FilterParamList[] = [];

  selectedFilters$: Observable<ListFilters>;
  form: FormGroup;
  courseId: string;
  showPreviewTemplate: boolean;

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
    this.courseId = this.route.snapshot.paramMap.get('id');

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

  onSearch(searchPhrase: string): void {
    this.form.patchValue({ filter: searchPhrase });
  }

  toggleSort(column?: string, direction?: number): void {
    this.store.dispatch(new ToggleSort(column, direction));
  }

  onPageChange(page: number): void {
    this.store.dispatch(new ChangePage(page));
  }

  onQueryParamsChange(event: NzTableQueryParams) {
    const column = event.sort.find((_) => _.value !== null);
    this.onPageChange(event.pageIndex);
    this.toggleSort(column?.key, column?.value === 'ascend' ? 1 : column?.value === 'descend' ? -1 : null);
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

    this.store.dispatch(new PreviewNotificationTemplate(this.courseId, data));

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

  public filterPillsUpdated(change: Partial<ISearchParams>): void {
    this.patchForm(change);
    if (change.trigger) {
      this.updateFilterData(this.filterTrigger, change.trigger);
    }
    if (change.recipient) {
      this.updateFilterData(this.filterRecipient, change.recipient);
    }
  }

  private patchForm(change: Partial<ISearchParams>): void {
    this.form.patchValue(change);
  }

  private fetchNotifications(): void {
    this.store.dispatch(new FetchCourseDetailsILTNotifications(this.courseId));
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

  private updateFilterData(arr: FilterParamList[], changeArr: string[]): void {
    arr.forEach((x) => {
      x.selected = changeArr.includes(x.value);
    });
  }
}
