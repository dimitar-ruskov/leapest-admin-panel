import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzModalService } from 'ng-zorro-antd/modal';

import {
  ChangeEmailHistoryPaginationParams,
  GetEmailHistory,
  PreviewNotificationHistoryTemplate
} from "./state/email-history.action";
import {EmailHistoryState} from "./state/email-history.state";
import { EmailNotification, IPageableEmailHistory } from '../../../../../../../../../../../../libs/shared/src/lib/models/notifications/email-history.model';
import { EmailHistoryService } from '../../../../../../../../../../../../libs/shared/src/lib/services/events/email-history.service';
import { ResendEmailModalComponent } from '../../../../../../../../../../../../libs/shared/src/lib/components/modals/resend-email-modal/resend-email-modal.component';

import {
  createPageableFromTableQueryParams,
  DeferredResource
} from "../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  EnvironmentService,
  NotificationService
} from "../../../../../../../../../../../../libs/shared/src/lib/services/common";
import {IProfile} from "../../../../../../../../../../../../libs/shared/src/lib/models";


const NO_LEARNERS_TEXT = 'No notifications have been sent';

@Component({
  selector: 'leap-email-history',
  templateUrl: './email-history.component.html',
  styleUrls: ['./email-history.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class EmailHistoryComponent implements OnInit {
  noResultsText = NO_LEARNERS_TEXT;
  public searchPlaceholder = 'Search Participants...';

  @Select(EmailHistoryState.loading)
  loading$: Observable<boolean>;

  @Select(EmailHistoryState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(EmailHistoryState.mailList)
  mailList$: Observable<EmailNotification[]>;

  @Select(EmailHistoryState.pageSize)
  pageSize$: Observable<number>;

  @Select(EmailHistoryState.total)
  total$: Observable<number>;

  @Select(EmailHistoryState.pageIndex)
  pageIndex$: Observable<number>;

  @Select(EmailHistoryState.previewTemplate)
  previewTemplate$: Observable<DeferredResource<any>>;

  @Input() venue: { configKey: string };
  @Input() trigger: { configKey: string; configValue: string };
  @Input() recipient: { configKey: string };
  @Input() subject: string;
  @Input() updatedAt: Date;
  @Input() eventId: string;

  public username: string;
  public showPreviewTemplate: boolean;

  trackByFn: TrackByFunction<EmailNotification> = (index, item) => item.id;

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly notification: NotificationService,
    private readonly service: EmailHistoryService,
    private readonly modalService: NzModalService,
    public readonly environmentService: EnvironmentService,
  ) {}

  ngOnInit(): void {
    this.username = this.store.selectSnapshot((state) => state.session.userDetails.username);
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable: IPageableEmailHistory = createPageableFromTableQueryParams(queryParams);

    pageable.venue = this.venue.configKey;
    pageable.trigger = this.trigger.configKey;
    pageable.recipient = this.recipient.configKey;
    this.store.dispatch([
      new ChangeEmailHistoryPaginationParams({ pageable }),
      new GetEmailHistory({ classEventId: this.eventId }),
    ]);
  }

  onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeEmailHistoryPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetEmailHistory({ classEventId: this.eventId }),
    ]);
  }

  public onPreviewClicked(email: EmailNotification): void {
    event.stopPropagation();
    this.store.dispatch(new PreviewNotificationHistoryTemplate(email.hedwigEmailId));
    this.showPreviewTemplate = true;
  }

  public resendTemplateModal(recipient: IProfile, hedwigEmailId: string): void {
    const { firstName, lastName, type, username } = recipient;
    const name = firstName ? `${firstName} ${lastName}` : 'N/A';
    let loading = false;
    const modal = this.modalService.create({
      nzTitle: 'Resend Notification',
      nzWidth: '660px',
      nzContent: ResendEmailModalComponent,
      nzWrapClassName: 'modal-class',
      nzComponentParams: {
        trigger: this.trigger,
        subject: this.subject,
        updatedAt: this.updatedAt,
        recipientName: name,
        recipientRole: type,
        recipientEmail: username,
      },
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Resend',
          loading: () => loading,
          type: 'primary',
          onClick: (data) => {
            loading = true;

            this.service
              .resendEmail(hedwigEmailId)
              .pipe(
                filter((resource) => !resource.isPending),
                untilDestroyed(this),
              )
              .subscribe((res) => {
                loading = false;
                modal.destroy();
                if (res.isSuccess) {
                  this.notification.success(`This Template has been re-sent to ${name}`);
                } else {
                  this.notification.error(`This Template wasn't re-sent to ${name}`);
                }
              });
          },
        },
      ],
    });
  }
}
