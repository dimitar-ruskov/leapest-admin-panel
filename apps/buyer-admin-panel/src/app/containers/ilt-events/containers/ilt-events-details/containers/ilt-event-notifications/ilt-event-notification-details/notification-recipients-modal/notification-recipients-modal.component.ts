import { Component, ChangeDetectionStrategy, Input, TrackByFunction } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import {createPageableFromTableQueryParams} from "../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  NotificationRecipientModel,
  NotificationRecipientsListModel
} from "../../../../../../../../../../../../libs/shared/src/lib/models/interfaces/notifications/notifications.model";
import {
  GetNotificationRecipients
} from "../../state/ilt-event-details-notifications.actions";

@Component({
  selector: 'leap-notification-recipients-modal',
  templateUrl: './notification-recipients-modal.component.html',
  styleUrls: ['./notification-recipients-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class NotificationRecipientsModalComponent {
  @Input() recipients$: Observable<NotificationRecipientsListModel>;
  @Input() recipientsLoading$: Observable<boolean>;
  @Input() details: { eventId: string; trigger: string; recipient: string };

  loading: boolean;

  trackByFn: TrackByFunction<NotificationRecipientModel> = (index, item) => item.userName;

  constructor(private readonly store: Store) {}

  getRecipientName(recipient: NotificationRecipientModel): string {
    if (recipient.firstName || recipient.lastName) {
      return (recipient.firstName ? recipient.firstName + ' ' : '') + (recipient.lastName ? recipient.lastName : '');
    } else {
      return 'N/A';
    }
  }

  onSearchChange(search: string): void {
    this.store.dispatch(
      new GetNotificationRecipients(this.details.eventId, this.details.trigger, this.details.recipient, {
        filter: search,
        page: 1,
      }),
    );
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);
    this.store.dispatch(
      new GetNotificationRecipients(this.details.eventId, this.details.trigger, this.details.recipient, pageable),
    );
  }
}
