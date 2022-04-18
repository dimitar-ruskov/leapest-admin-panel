import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Select, Store } from "@ngxs/store";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { NzModalService } from "ng-zorro-antd/modal";

import { GetNotificationsSettings, UpdateNotificationsLogo } from "../../state/notifications-settings.action";
import { NotificationsSettingsStateModel } from "../../state/notifications-settings.state";
import { IGlobalStateModel } from "../../../../../../state/state.model";

import {
  NotificationLogoModalComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/modals/notification-logo-modal/notification-logo-modal.component";
import {
  DownloadSphinxService
} from "../../../../../../../../../../libs/shared/src/lib/services/common/download-sphinx.service";

@Component({
  selector: 'leap-notifications-settings',
  templateUrl: './notifications-settings.component.html',
  styleUrls: ['./notifications-settings.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class NotificationsSettingsComponent implements OnInit {
  @Select((state: IGlobalStateModel) => state.notifications['notificationsSettings'])
  settings$: Observable<NotificationsSettingsStateModel>;

  settings: NotificationsSettingsStateModel;
  logoLink: string;

  constructor(
    private readonly store: Store,
    private readonly modalService: NzModalService,
    private readonly cdr: ChangeDetectorRef,
    private readonly downloadSphinxService: DownloadSphinxService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new GetNotificationsSettings());

    this.settings$.pipe(untilDestroyed(this)).subscribe((settings: NotificationsSettingsStateModel) => {
      this.settings = settings;
      if (settings.notificationLogoBucket && settings.notificationLogoKey) {
        this.logoLink = this.getLogoLink(settings.notificationLogoBucket, settings.notificationLogoKey);
      }
      this.cdr.detectChanges();
    });
  }

  openEditLogo(): void {
    const modal = this.modalService.create({
      nzTitle: 'Notifications Logo',
      nzWidth: '660px',
      nzContent: NotificationLogoModalComponent,
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
          disabled: (instance) => !instance.isFileUploaded,
          onClick: (instance) => {
            this.store.dispatch(
              new UpdateNotificationsLogo({
                notificationLogoBucket: instance.s3Bucket,
                notificationLogoKey: instance.s3Key,
              }),
            );
            modal.destroy();
          },
        },
      ],
    });
  }

  private getLogoLink(bucket: string, key: string) {
    return this.downloadSphinxService.getSphinxUrl(bucket, key);
  }
}
