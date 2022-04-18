import { Component, ChangeDetectionStrategy, Input, TrackByFunction, Output, EventEmitter } from '@angular/core';
import {CertificateInfo, GeneralInfoFieldValue, GeneralInfoUser} from "../../../../models";

@Component({
  selector: 'leap-general-info-field-value',
  template: `
    <ng-container [ngSwitch]="fieldValue.contentType">
      <span
        *ngSwitchCase="'html'"
        class="general-info-field-value__html-content"
        [innerHTML]="fieldValue.content || '-'"
        [ngStyle]="fieldValue.styles"
      ></span>
      <ng-container *ngSwitchCase="'user'">
        <div
          *ngFor="let user of fieldValue.content; trackBy: userTrackByFn"
          class="general-info-field-value__user"
          [ngStyle]="fieldValue.styles"
        >
          <p>{{ user.name }}</p>
          <p>{{ user.email }}</p>
        </div>
      </ng-container>

      <div class="general-info-field-value__view" *ngSwitchCase="'certificate'">
        <ng-container *ngIf="content.value; else content.delete ? noCertificateCourse : noCertificateEvent">
          <div *ngIf="content.parentId" class="general-info-field-value__text-content" style="padding-bottom: 8px">
            Participation Certificate is <b>{{ content.enabled ? 'Enabled' : 'Disabled' }}</b>
          </div>
          <leap-certificate-view
            [settings]="content"
            [disabled]="!content.enabled"
            (download)="download.emit(content)"
            (delete)="delete.emit()"
            (preview)="preview.emit(content)"
          >
          </leap-certificate-view>
        </ng-container>
        <ng-template #noCertificateCourse>
          <div class="general-info-field-value__text-content">
            You have not added any certificate to this course yet.
          </div>
        </ng-template>
        <ng-template #noCertificateEvent>
          <div class="no-certificate">
            It appears that you do not have any active participation certificate yet. If you wish to use one for this
            course, please add it to the
            <a [href]="'hw/admin/ilt-courses/details/' + content.parentId">Course Template</a> first
          </div>
        </ng-template>
      </div>

      <div *ngSwitchDefault class="general-info-field-value__text-content" [ngStyle]="fieldValue.styles">
        <span>{{ fieldValue.content || '-' }}</span
        ><br />
        <span class="description">{{ fieldValue.description }}</span>
      </div>
    </ng-container>
  `,
  styleUrls: ['./general-info-field-value.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInfoFieldValueComponent {
  @Input() fieldValue: GeneralInfoFieldValue;
  @Output() download: EventEmitter<CertificateInfo> = new EventEmitter<CertificateInfo>();
  @Output() delete: EventEmitter<null> = new EventEmitter<null>();
  @Output() preview: EventEmitter<CertificateInfo> = new EventEmitter<CertificateInfo>();
  userTrackByFn: TrackByFunction<GeneralInfoUser> = (index, item) => item.email;

  get content(): CertificateInfo {
    return this.fieldValue.content as CertificateInfo;
  }
}
