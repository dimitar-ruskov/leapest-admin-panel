import { Component, ChangeDetectionStrategy, Input, TrackByFunction, OnInit } from "@angular/core";
import { Observable } from 'rxjs';
import { filter, tap } from "rxjs/operators";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { createPageableFromTableQueryParams, DeferredResource } from "../../../utils/common";
import {
  IPageable,
  NotificationRecipientModel,
  NotificationRecipientsListModel
} from "../../../models";
import { IltEventNotificationsService } from "../../../services/events/ilt-event-notifications.service";

@Component({
  selector: 'leap-notification-recipients-modal',
  templateUrl: './notification-recipients-modal.component.html',
  styleUrls: ['./notification-recipients-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class NotificationRecipientsModalComponent implements OnInit {
  @Input() recipients$: Observable<NotificationRecipientsListModel>;
  @Input() details: { eventId: string; trigger: string; recipient: string };

  recipients: NotificationRecipientsListModel;
  recipientsLoading: boolean;

  trackByFn: TrackByFunction<NotificationRecipientModel> = (index, item) => item.userName;

  constructor(private readonly eventNotificationsService: IltEventNotificationsService) {}

  ngOnInit(): void {
    this.recipients$
      .pipe(
        untilDestroyed(this),
        filter(recipients => !!recipients)
      )
      .subscribe((recipients: NotificationRecipientsListModel) => this.recipients = recipients);
  }

  getRecipientName(recipient: NotificationRecipientModel): string {
    if (recipient.firstName || recipient.lastName) {
      return (recipient.firstName ? recipient.firstName + ' ' : '') + (recipient.lastName ? recipient.lastName : '');
    } else {
      return 'N/A';
    }
  }

  getRecipientsList(eventId: string, trigger: string, recipient: string, pageable: IPageable): void {
    this.eventNotificationsService.getRecipients(eventId, trigger, recipient, pageable).pipe(
      untilDestroyed(this),
      tap((data: DeferredResource<NotificationRecipientsListModel>) => {
        this.recipientsLoading = true;
        if (data.isSuccess) {
          this.recipientsLoading = false;
          this.recipients = data.response;
        }
      })
    )
  }

  onSearchChange(search: string): void {
    this.getRecipientsList(this.details.eventId, this.details.trigger, this.details.recipient, {
      filter: search,
      page: 1,
    });
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);
    this.getRecipientsList(this.details.eventId, this.details.trigger, this.details.recipient, pageable);
  }
}
