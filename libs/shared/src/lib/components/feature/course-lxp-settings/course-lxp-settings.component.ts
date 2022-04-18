import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { filter, map } from 'rxjs/operators';

import { CourseLxpSettingsService } from '../../../services/publishing/course-lxp-settings.service';
import {DeferredResource} from "../../../utils/common";
import {PublishCourseToLXP, PublishedILTCourse, TargetLxpDomain} from "../../../models";
import {ActiveSelfPacedCourse} from "../../../models/courses/sp-courses/sp-course.model";
import {PublishToLxpModalComponent} from "../../modals/publish-to-lxp-modal/publish-to-lxp-modal.component";

@Component({
  selector: 'leap-course-lxp-settings',
  templateUrl: './course-lxp-settings.component.html',
  styleUrls: ['./course-lxp-settings.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseLxpSettingsComponent implements OnInit {
  @Input() course: PublishedILTCourse | ActiveSelfPacedCourse;
  @Output() publishCourse = new EventEmitter<PublishCourseToLXP>();

  singleLXP: boolean;
  domain: TargetLxpDomain;
  domains: TargetLxpDomain[];

  constructor(
    private readonly modalService: NzModalService,
    private readonly cdr: ChangeDetectorRef,
    private readonly courseLxpSettingsService: CourseLxpSettingsService,
  ) {}

  ngOnInit(): void {
    this.singleLXP = this.course.lxpCourses?.length === 1;
    this.courseLxpSettingsService
      .getTargetDomains(this.course.id)
      .pipe(
        filter((resource: DeferredResource<TargetLxpDomain[]>) => resource.isSuccess),
        map((resource: DeferredResource<TargetLxpDomain[]>) => resource.response),
      )
      .subscribe((domains: TargetLxpDomain[]) => (this.domains = domains));
  }

  openPublishLxpModal(): void {
    if (this.domain) {
      const modal = this.modalService.create({
        nzTitle: `Publish to ${this.domain.domainName} LXP`,
        nzContent: PublishToLxpModalComponent,
        nzComponentParams: {
          name: this.course.name,
          domain: this.domain,
          specificExternalSKU: this.course.specificExternalSKU,
          externalSKU: this.course.externalSKU,
        },
        nzFooter: [
          {
            label: 'Cancel',
            type: 'default',
            onClick: () => modal.destroy(),
          },
          {
            label: 'Publish to LXP',
            type: 'primary',
            disabled: (d) => d.form.invalid,
            onClick: async (data) => {
              const formValue = data.form.getRawValue();
              const lxpPrivate = formValue.lxpPrivate;
              let lxpRestrictUsers = formValue.lxpRestrictUsers;
              let lxpRestrictGroups = formValue.lxpRestrictGroups;
              let lxpPublishGroups = formValue.lxpGroups;
              let lxpPublishChannels = formValue.lxpChannels;
              let publishedExternalSKU;

              if (this.course.specificExternalSKU) {
                publishedExternalSKU = formValue.externalSKU;
              }

              if (!lxpRestrictUsers || lxpRestrictUsers.length < 1) {
                lxpRestrictUsers = null;
              }
              if (!lxpRestrictGroups || lxpRestrictGroups.length < 1) {
                lxpRestrictGroups = null;
              }
              if (!lxpPublishGroups || lxpPublishGroups.length < 1) {
                lxpPublishGroups = null;
              }
              if (!lxpPublishChannels || lxpPublishChannels.length < 1) {
                lxpPublishChannels = null;
              } else if (lxpPrivate === false) {
                lxpRestrictUsers = null;
                lxpRestrictGroups = null;
              }

              this.publishCourse.emit({
                code: this.course.code,
                domain: this.domain.domainName,
                lxpPrivate,
                lxpRestrictUsers,
                lxpRestrictGroups,
                groups: lxpPublishGroups,
                channels: lxpPublishChannels,
                externalSKU: publishedExternalSKU,
              });
              modal.destroy();
            },
          },
        ],
      });
    }
  }
}
