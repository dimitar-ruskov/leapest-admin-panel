import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { OktaAuthStateService } from '@okta/okta-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import {
  ClearNotificationDetails,
  ClearNotificationDetailsPartial,
  GetNotificationDetails,
  GetNotificationRecipients,
  GetReportingManagerMapping,
  PreviewNotificationTemplate,
  ResetNotificationTemplate,
  TestEmail,
  UpdateNotificationTemplate,
} from '../state/ilt-event-details-notifications.actions';
import {IGlobalStateModel} from "../../../../../../../state/state.model";

import {
  NotificationPreviewModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/notification-preview-modal/notification-preview-modal.component";
import {DeferredResource} from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  NotificationModel, NotificationPayloadModel,
  NotificationRecipientsListModel, NotificationResetLevel,
  ReportingDomainsMap, TemplateComposerModel
} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces/notifications/notifications.model";
import {
  NotificationChangeModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/notification-change-modal/notification-change-modal.component";
import {
  NotificationRecipientsModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/notification-recipients-modal/notification-recipients-modal.component";

@Component({
  selector: 'leap-ilt-event-notification-details',
  templateUrl: './ilt-event-notification-details.component.html',
  styleUrls: ['./ilt-event-notification-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltEventNotificationDetailsComponent implements OnInit, OnDestroy {
  @Select((state: IGlobalStateModel) => state.iltEvents.iltEventDetails['iltEventDetailsNotifications'].details)
  details$: Observable<DeferredResource<NotificationModel>>;

  @Select((state: IGlobalStateModel) => state.iltEvents.iltEventDetails['iltEventDetailsNotifications'].recipients)
  recipients$: Observable<NotificationRecipientsListModel>;

  @Select((state: IGlobalStateModel) => state.iltEvents.iltEventDetails['iltEventDetailsNotifications'].recipientsLoading)
  recipientsLoading$: Observable<boolean>;

  @Select((state: IGlobalStateModel) => state.iltEvents.iltEventDetails['iltEventDetailsNotifications'].testEmail)
  testEmail$: Observable<DeferredResource<string>>;

  @Select((state: IGlobalStateModel) => state.iltEvents.iltEventDetails['iltEventDetailsNotifications'].resetTemplate)
  resetTemplate$: Observable<DeferredResource<NotificationModel>>;

  @Select((state: IGlobalStateModel) => state.iltEvents.iltEventDetails['iltEventDetailsNotifications'].updateTemplate)
  updateTemplate$: Observable<DeferredResource<NotificationModel>>;

  @Select((state: IGlobalStateModel) => state.iltEvents.iltEventDetails['iltEventDetailsNotifications'].previewTemplate)
  previewTemplate$: Observable<DeferredResource<string>>;

  @Select((state: IGlobalStateModel) => state.iltEvents.iltEventDetails['iltEventDetailsNotifications'].reportingManagerMapping)
  reportingManagerMapping$: Observable<DeferredResource<ReportingDomainsMap[]>>;

  trigger: string;
  recipient: string;
  venue: string;
  eventSku: string;
  domain: string;

  loading: boolean;
  draftTemplate: TemplateComposerModel;

  notificationResetLevel = [
    { key: NotificationResetLevel.DEFAULT, value: 'Reset to Default' },
    { key: NotificationResetLevel.DOMAIN, value: 'Reset to Org Default' },
    { key: NotificationResetLevel.COURSE, value: 'Reset to Course Default' },
  ];

  resetLevel = this.notificationResetLevel[0].key;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly messageService: NzMessageService,
    private readonly router: Router,
    private readonly oktaAuthStateService: OktaAuthStateService,
    private readonly modalService: NzModalService,
  ) {}

  async ngOnInit(): Promise<void> {
    const params = this.route.snapshot.paramMap;
    this.trigger = params.get('trigger');
    this.recipient = params.get('recipient');
    this.venue = params.get('venue');
    this.eventSku = params.get('sku');

    const oktaUser = await this.oktaAuthStateService['oktaAuth'].getUser();
    this.domain = oktaUser['mkpDomain'];

    this.store.dispatch([
      new GetReportingManagerMapping(),
      new GetNotificationDetails(this.eventSku, this.trigger, this.recipient, this.venue),
      new GetNotificationRecipients(this.eventSku, this.trigger, this.recipient),
    ]);

    this.testEmail$
      .pipe(
        filter((_) => _ && _.isSuccess),
        untilDestroyed(this),
      )
      .subscribe((_) => {
        this.store.dispatch(new ClearNotificationDetailsPartial());
        this.messageService.create('success', 'You will receive a test email shortly. Please, check your email inbox.');
      });

    this.resetTemplate$
      .pipe(
        filter((resource) => resource && !resource.isPending),
        untilDestroyed(this),
      )
      .subscribe((resource) => {
        this.loading = false;
        this.store.dispatch(new ClearNotificationDetailsPartial());

        if (resource.isSuccess) {
          this.messageService.create('success', 'The template has been reset.');
        } else if (resource.error && resource.error.status === 400) {
          this.messageService.create('error', 'The template already matches the default settings.');
        }
        this.modalService.closeAll();
      });

    this.updateTemplate$
      .pipe(
        filter((resource) => resource && !resource.isPending),
        untilDestroyed(this),
      )
      .subscribe((resource) => {
        this.loading = false;
        this.store.dispatch(new ClearNotificationDetailsPartial());

        if (resource.isSuccess) {
          this.messageService.create('success', 'The template has been updated.');
          this.draftTemplate = undefined;
        } else if (resource.error) {
          this.messageService.create('error', 'Something went wrong.');
        }
        this.modalService.closeAll();
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ClearNotificationDetails());
  }

  resetTemplate(level: string): void {
    this.store.dispatch(new ResetNotificationTemplate(this.eventSku, this.trigger, this.recipient, this.venue, level));
  }

  sendTestEmail(): void {
    this.store.dispatch(new TestEmail(this.trigger, this.recipient, this.venue));
  }

  openPreviewTemplate(payload: TemplateComposerModel): void {
    const data: NotificationPayloadModel = {
      subject: payload.subject,
      emailMarkup: payload.message,
      trigger: { configKey: this.trigger },
      recipient: { configKey: this.recipient },
      venue: { configKey: this.venue },
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

  openResetTemplate(level: string): void {
    const modal = this.modalService.create({
      nzTitle: `Reset to ${level.toUpperCase()}?`,
      nzWidth: '660px',
      nzContent: NotificationChangeModalComponent,
      nzComponentParams: {
        isReset: true,
        level,
      },
      nzWrapClassName: 'modal-class',
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save',
          type: 'primary',
          loading: () => this.loading,
          onClick: () => {
            this.resetTemplate(level);
            this.loading = true;
          },
        },
      ],
    });
  }

  confirmUpdateTemplate(payload: TemplateComposerModel): void {
    if (payload.subject) {
      this.draftTemplate = payload;

      const modal = this.modalService.create({
        nzTitle: 'Save Email Template?',
        nzWidth: '660px',
        nzContent: NotificationChangeModalComponent,
        nzWrapClassName: 'modal-class',
        nzFooter: [
          {
            label: 'Cancel',
            type: 'default',
            onClick: () => modal.destroy(),
          },
          {
            label: 'Save',
            type: 'primary',
            loading: () => this.loading,
            onClick: () => {
              this.updateTemplate();
              this.loading = true;
            },
          },
        ],
      });
    }
  }

  updateTemplate(): void {
    const payload = this.draftTemplate;
    const data = {
      subject: payload.subject,
      subjectJSON: payload.subjectJSON,
      informReportingManager: payload.cc,
      emailMarkup: payload.message,
      trigger: { configKey: this.trigger },
      recipient: { configKey: this.recipient },
      venue: { configKey: this.venue },
    };
    this.store.dispatch(new UpdateNotificationTemplate(data));
  }

  openRecipientsModal(): void {
    const modal = this.modalService.create({
      nzTitle: 'View Recipients',
      nzContent: NotificationRecipientsModalComponent,
      nzComponentParams: {
        recipients$: this.recipients$,
        recipientsLoading$: this.recipientsLoading$,
        details: {
          trigger: this.trigger,
          recipient: this.recipient,
          eventId: this.eventSku,
        },
      },
      nzWrapClassName: 'modal-class',
      nzWidth: '660px',
      nzFooter: [
        {
          label: 'Close',
          type: 'default',
          onClick: () => modal.destroy(),
        },
      ],
    });
  }

  onCancel(): void {
    this.router.navigate(['admin', 'ilt-events', 'details', this.eventSku]);
  }
}
