import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OktaAuthStateService } from "@okta/okta-angular";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";

import {
  ClearNotificationDetails,
  ClearNotificationDetailsPartial,
  GetNotificationDetails,
  GetReportingManagerMapping,
  PreviewNotificationTemplate,
  ResetNotificationTemplate,
  TestEmail,
  UpdateNotificationTemplate
} from "./state/notification-details.action";
import { ChangeNotificationsTab } from "../../state/notifications.actions";
import { IGlobalStateModel } from "../../../../state/state.model";

import {
  NotificationPreviewModalComponent
} from "../../../../../../../../libs/shared/src/lib/components/modals/notification-preview-modal/notification-preview-modal.component";
import { DeferredResource } from "../../../../../../../../libs/shared/src/lib/utils/common";
import {
  NotificationModel,
  NotificationPayloadModel,
  ReportingDomainsMap,
  TemplateComposerModel
} from "../../../../../../../../libs/shared/src/lib/models";
import {
  NotificationChangeModalComponent
} from "../../../../../../../../libs/shared/src/lib/components/modals/notification-change-modal/notification-change-modal.component";


@Component({
  selector: 'leap-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class NotificationDetailsComponent implements OnInit, OnDestroy {
  @Select((state: IGlobalStateModel) => state.notifications['notificationDetails'].details)
  details$: Observable<DeferredResource<NotificationModel>>;

  @Select((state: IGlobalStateModel) => state.notifications['notificationDetails'].testEmail)
  testEmail$: Observable<DeferredResource<string>>;

  @Select((state: IGlobalStateModel) => state.notifications['notificationDetails'].previewTemplate)
  previewTemplate$: Observable<DeferredResource<string>>;

  @Select((state: IGlobalStateModel) => state.notifications['notificationDetails'].resetTemplate)
  resetTemplate$: Observable<DeferredResource<NotificationModel>>;

  @Select((state: IGlobalStateModel) => state.notifications['notificationDetails'].updateTemplate)
  updateTemplate$: Observable<DeferredResource<NotificationModel>>;

  @Select((state: IGlobalStateModel) => state.notifications['notificationDetails'].reportingManagerMapping)
  reportingManagerMapping$: Observable<DeferredResource<ReportingDomainsMap[]>>;

  draftTemplate: TemplateComposerModel;
  domain: string;

  trigger: string;
  recipient: string;
  venue: string;

  loading: boolean;

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly messageService: NzMessageService,
    private readonly router: Router,
    private readonly modalService: NzModalService,
    private readonly oktaAuthStateService: OktaAuthStateService,
  ) {}

  async ngOnInit() {
    const params = this.route.snapshot.paramMap;
    this.trigger = params.get('trigger');
    this.recipient = params.get('recipient');
    this.venue = params.get('venue');

    const oktaUser = await this.oktaAuthStateService['oktaAuth'].getUser();
    this.domain = oktaUser['mkpDomain'];

    this.store.dispatch([
      new GetReportingManagerMapping(),
      new GetNotificationDetails(this.trigger, this.recipient, this.venue),
    ]);

    this.testEmail$
      .pipe(
        filter((resource) => resource && resource.isSuccess),
        untilDestroyed(this),
      )
      .subscribe((resource) => {
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

  ngOnDestroy() {
    this.store.dispatch(new ClearNotificationDetails());
  }

  resetTemplate(): void {
    this.store.dispatch(new ResetNotificationTemplate(this.trigger, this.recipient, this.venue, true));
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

  openResetTemplate() {
    const modal = this.modalService.create({
      nzTitle: 'Reset to Default?',
      nzWidth: '660px',
      nzContent: NotificationChangeModalComponent,
      nzComponentParams: {
        isReset: true,
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
            this.resetTemplate();
            this.loading = true;
          },
        },
      ],
    });
  }

  updateTemplate(payload: TemplateComposerModel): void {
    if (payload.subject) {
      this.draftTemplate = payload;
      const data: NotificationPayloadModel = {
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
  }

  onCancel() {
    this.router.navigate(['/', 'admin', 'notifications']);
    this.changeNotificationTab(1);
  }

  changeNotificationTab(tab: number) {
    this.store.dispatch(new ChangeNotificationsTab({ activeTab: tab }));
  }
}
