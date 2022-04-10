import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';

import { CreateSpCourseVariantHandlerService } from '../../services/create-sp-course-variant-handler.service';
import { SpCourseDetailsState } from './state/sp-course-details.state';
import {
  ChangeSelfPacedCourseDetailsTab,
  GetActiveSelfPacedCourse, PublishToLxp,
} from './state/sp-course-details.actions';

import { ActiveSelfPacedCourse } from '../../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course.model';
import {DeferredResource} from "../../../../../../../../libs/shared/src/lib/utils/common";
import {EnvironmentService} from "../../../../../../../../libs/shared/src/lib/utils/services/common";
import {
  PublishToLxpModalComponent
} from "../../../../../../../../libs/shared/src/lib/components/modals/publish-to-lxp-modal/publish-to-lxp-modal.component";

@Component({
  selector: 'leap-sp-course-details',
  templateUrl: './sp-course-details.component.html',
  styleUrls: ['./sp-course-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpCourseDetailsComponent implements OnInit {
  @Select(SpCourseDetailsState.selfPacedCourse)
  selfPacedCourse$: Observable<DeferredResource<ActiveSelfPacedCourse>>;

  publishToLxpPending: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef,
    private readonly createSpCourseLanguageVariantHandler: CreateSpCourseVariantHandlerService,
    private readonly modalService: NzModalService,
    public readonly environmentService: EnvironmentService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(take(1)).subscribe((paramMap: ParamMap) => {
      this.store.dispatch(new GetActiveSelfPacedCourse({ id: paramMap.get('id') }));
    });
  }

  onCreateNewLanguageVariant(event: MouseEvent, selfPacedCourse: ActiveSelfPacedCourse): void {
    event.stopPropagation();
    this.createSpCourseLanguageVariantHandler.createSpCourseLanguageVariant(selfPacedCourse);
  }

  onSelectTab(activeTab: number): void {
    this.store.dispatch(new ChangeSelfPacedCourseDetailsTab({ activeTab }));
  }

  openPublishLxpModal(
    name: string,
    code: string,
    domain: string,
    specificExternalSKU: boolean,
    externalSKU?: string,
  ): void {
    const modal = this.modalService.create({
      nzTitle: 'Publish Course to LXP',
      nzContent: PublishToLxpModalComponent,
      nzComponentParams: {
        name,
        specificExternalSKU,
        externalSKU,
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

            if (specificExternalSKU) {
              publishedExternalSKU = formValue.externalSKU;
            }

            if (!lxpRestrictUsers || lxpRestrictUsers.length < 1) {
              lxpRestrictUsers = null;
            }
            if (!lxpRestrictGroups || lxpRestrictGroups.length < 1) {
              lxpRestrictGroups = null;
            } else if (lxpPrivate === false) {
              lxpRestrictUsers = null;
              lxpRestrictGroups = null;
            }
            if (!lxpPublishGroups || lxpPublishGroups.length < 1) {
              lxpPublishGroups = null;
            }
            if (!lxpPublishChannels || lxpPublishChannels.length < 1) {
              lxpPublishChannels = null;
            }
            this.store
              .dispatch(
                new PublishToLxp({
                  code,
                  domain,
                  lxpPrivate,
                  lxpRestrictUsers,
                  lxpRestrictGroups,
                  groups: lxpPublishGroups,
                  channels: lxpPublishChannels,
                  externalSKU: publishedExternalSKU,
                }),
              )
              .toPromise()
              .then(() => {
                this.publishToLxpPending = true;
                this.cdr.detectChanges();
                modal.destroy();
              });
          },
        },
      ],
    });
  }
}
