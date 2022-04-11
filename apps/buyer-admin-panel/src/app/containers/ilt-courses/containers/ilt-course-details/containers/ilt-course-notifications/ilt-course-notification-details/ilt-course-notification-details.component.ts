import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { OktaAuthStateService } from '@okta/okta-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import {
  ClearNotificationDetails,
  ClearNotificationDetailsPartial,
  GetNotificationDetails,
  GetReportingManagerMapping,
  PreviewNotificationTemplate,
  ResetNotificationTemplate,
  TestEmail,
  UpdateNotificationTemplate,
} from '../state/ilt-course-details-notifications.actions';

import {IGlobalStateModel} from "../../../../../../../state/state.model";

import {
  NotificationPreviewModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/notification-preview-modal/notification-preview-modal.component";
import {DeferredResource} from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  NotificationModel, NotificationPayloadModel, NotificationResetLevel,
  ReportingDomainsMap
} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces/notifications/notifications.model";
import {
  NotificationChangeModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/notification-change-modal/notification-change-modal.component";
import {
  TemplateComposerModel
} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces/notifications/template-composer.model";

@Component({
  selector: 'leap-ilt-course-notification-details',
  templateUrl: './ilt-course-notification-details.component.html',
  styleUrls: ['./ilt-course-notification-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltCourseNotificationDetailsComponent implements OnInit, OnDestroy {
  @Select((state: IGlobalStateModel) => state.iltCourses.iltCourseDetails['iltCourseDetailsNotifications'].details)
  details$: Observable<DeferredResource<NotificationModel>>;

  @Select((state: IGlobalStateModel) => state.iltCourses.iltCourseDetails['iltCourseDetailsNotifications'].testEmail)
  testEmail$: Observable<DeferredResource<string>>;

  @Select((state: IGlobalStateModel) => state.iltCourses.iltCourseDetails['iltCourseDetailsNotifications'].resetTemplate)
  resetTemplate$: Observable<DeferredResource<NotificationModel>>;

  @Select((state: IGlobalStateModel) => state.iltCourses.iltCourseDetails['iltCourseDetailsNotifications'].updateTemplate)
  updateTemplate$: Observable<DeferredResource<NotificationModel>>;

  @Select((state: IGlobalStateModel) => state.iltCourses.iltCourseDetails['iltCourseDetailsNotifications'].previewTemplate)
  previewTemplate$: Observable<DeferredResource<string>>;

  @Select((state: IGlobalStateModel) => state.iltCourses.iltCourseDetails['iltCourseDetailsNotifications'].reportingManagerMapping)
  reportingManagerMapping$: Observable<DeferredResource<ReportingDomainsMap[]>>;

  trigger: string;
  recipient: string;
  venue: string;
  courseId: string;
  domain: string;

  loading: boolean;
  draftTemplate: TemplateComposerModel;

  notificationResetLevel = [
    { key: NotificationResetLevel.DEFAULT, value: 'Reset to Default' },
    { key: NotificationResetLevel.DOMAIN, value: 'Reset to Org Default' },
  ];

  resetLevel = this.notificationResetLevel[0].key;

  constructor(
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
    this.courseId = params.get('id');

    const oktaUser = await this.oktaAuthStateService['oktaAuth'].getUser();
    this.domain = oktaUser['mkpDomain'];

    this.store.dispatch([
      new GetReportingManagerMapping(),
      new GetNotificationDetails(this.courseId, this.trigger, this.recipient, this.venue),
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
    this.store.dispatch(new ResetNotificationTemplate(this.courseId, this.trigger, this.recipient, this.venue, level));
  }

  sendTestEmail(): void {
    this.store.dispatch(new TestEmail(this.courseId, this.trigger, this.recipient, this.venue));
  }

  openPreviewTemplate(payload: TemplateComposerModel): void {
    const data: NotificationPayloadModel = {
      subject: payload.subject,
      emailMarkup: payload.message,
      trigger: { configKey: this.trigger },
      recipient: { configKey: this.recipient },
      venue: { configKey: this.venue },
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
    this.store.dispatch(new UpdateNotificationTemplate(this.courseId, data));
  }

  onCancel(): void {
    this.router.navigate(['admin', 'ilt-courses', 'details', this.courseId]);
  }
}
