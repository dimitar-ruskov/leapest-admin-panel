import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzTabsCanDeactivateFn } from 'ng-zorro-antd/tabs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import produce, { Draft } from 'immer';

import { ScheduleCourseEventHandlerService } from '../../../../../../../../libs/shared/src/lib/services/courses/ilt-courses/schedule-course-event-handler.service';
import { IltCourseDetailsState } from './state/ilt-course-details.state';
import {
  ChangeILTCourseDetailsTab,
  DeleteCourse,
  PublishToLxp,
  GetILTCourse,
  DiscardILTCourseAgendaChanges,
  DiscardILTCourseMaterialsChanges,
  UpdateILTCourseAgenda,
  UpdateILTCourseMaterials,
} from './state/ilt-course-details.actions';

import {
  ILTCourseAgenda, InternalRepositories,
  InternalRepositoryMaterial, PublishedILTCourse
} from "../../../../../../../../libs/shared/src/lib/models";
import {DeferredResource} from "../../../../../../../../libs/shared/src/lib/utils/common";
import {
  CourseAgendaController, CourseAgendaUnsavedChangesGuard, CourseMaterialsController,
  CourseMaterialsUnsavedChangesGuard
} from "../../../../../../../../libs/shared/src/lib/utils/guards";
import {
  DeleteCourseConfirmModalComponent
} from "../../../../../../../../libs/shared/src/lib/components/modals/delete-course-confirm-modal/delete-course-confirm-modal.component";
import {EnvironmentService} from "../../../../../../../../libs/shared/src/lib/services/common";
import {ButtonState} from "./containers/ilt-course-materials/ilt-course-materials.component";
import {
  PublishToLxpModalComponent
} from "../../../../../../../../libs/shared/src/lib/components/modals/publish-to-lxp-modal/publish-to-lxp-modal.component";


@Component({
  selector: 'leap-ilt-course-details',
  templateUrl: './ilt-course-details.component.html',
  styleUrls: ['./ilt-course-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltCourseDetailsComponent implements OnInit, CourseAgendaController, CourseMaterialsController {
  showAgendaSaveChanges: ButtonState;
  showMaterialsSaveChanges: ButtonState;
  templateAgenda: ILTCourseAgenda;
  templateMaterials: InternalRepositories;
  publishToLxpPending: boolean;

  @Select(IltCourseDetailsState.iltCourse)
  iltCourse$: Observable<DeferredResource<PublishedILTCourse>>;

  canDeactivateTab: NzTabsCanDeactivateFn = (fromIndex: number) => {
    if (fromIndex === 2 && this.showAgendaSaveChanges) {
      return this.courseAgendaUnsavedChangesGuard.checkIfCanDeactivate(this);
    }
    if (fromIndex === 1 && this.showMaterialsSaveChanges) {
      return this.courseMaterialsUnsavedChangesGuard.checkIfCanDeactivate(this);
    }

    return true;
  };

  @HostListener('window:pagehide', ['$event'])
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event): void {
    if (this.showAgendaSaveChanges) {
      event.preventDefault();
      event.returnValue = '';
    }
    if (this.showMaterialsSaveChanges) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly scheduleCourseEventHandlerService: ScheduleCourseEventHandlerService,
    private readonly cdr: ChangeDetectorRef,
    private readonly courseAgendaUnsavedChangesGuard: CourseAgendaUnsavedChangesGuard,
    private readonly courseMaterialsUnsavedChangesGuard: CourseMaterialsUnsavedChangesGuard,
    private readonly modalService: NzModalService,
    private readonly router: Router,
    public readonly environmentService: EnvironmentService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(take(1)).subscribe((paramMap: ParamMap) => {
      this.store.dispatch(new GetILTCourse({ id: paramMap.get('id') }));
    });
  }

  onScheduleEvent(event: MouseEvent, course: PublishedILTCourse): void {
    event.stopPropagation();
    this.scheduleCourseEventHandlerService.scheduleCourseEvent(course);
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

  onSelectTab(activeTab: number): void {
    this.store.dispatch(new ChangeILTCourseDetailsTab({ activeTab }));
  }

  onAgendaValueAndValidityChange({
    valid,
    changed,
    value,
  }: {
    valid: boolean;
    changed: boolean;
    value: ILTCourseAgenda;
  }) {
    if (changed) {
      this.showAgendaSaveChanges = valid ? 'active' : 'disabled';
    }
    this.templateAgenda = value;
    this.cdr.markForCheck();
  }

  onAgendaSaveChanges(): void {
    this.saveAgendaChanges().subscribe();
  }

  saveAgendaChanges(): Observable<boolean> {
    this.showAgendaSaveChanges = 'loading';
    this.cdr.markForCheck();

    return this.iltCourse$.pipe(
      take(1),
      switchMap((deferredResource: DeferredResource<PublishedILTCourse>) => {
        const payload = produce(deferredResource.response, (a: Draft<PublishedILTCourse>) => {
          a.hierarchicalAgenda = this.templateAgenda.days.map((d) => {
            return {
              startDateTime: d.startDateTime,
              items: d.items.map((i) => ({
                description: i.description,
                duration: i.duration,
                title: i.title,
                type: i.type,
              })),
            };
          });
        });

        return this.store.dispatch([new UpdateILTCourseAgenda(payload, 'agenda')]).pipe(
          take(1),
          map(() => {
            this.showAgendaSaveChanges = null;
            this.cdr.markForCheck();

            return true;
          }),
        );
      }),
    );
  }

  discardAgendaChanges(): Observable<boolean> {
    return this.store.dispatch(new DiscardILTCourseAgendaChanges()).pipe(
      take(1),
      map(() => {
        this.showAgendaSaveChanges = null;
        this.cdr.markForCheck();

        return true;
      }),
    );
  }

  onMaterialsValueAndValidityChange({
    changed,
    value,
  }: {
    valid: boolean;
    changed: boolean;
    value: InternalRepositories;
  }) {
    if (changed) {
      this.showMaterialsSaveChanges = 'active';
    }
    this.templateMaterials = value;
    this.cdr.markForCheck();
  }

  onMaterialsSaveChanges(): void {
    this.saveMaterialsChanges().subscribe();
  }

  saveMaterialsChanges(): Observable<boolean> {
    this.showMaterialsSaveChanges = 'loading';
    this.cdr.markForCheck();

    return this.iltCourse$.pipe(
      take(1),
      switchMap((deferredResource: DeferredResource<PublishedILTCourse>) => {
        const payload = this.generateMaterials(deferredResource.response, this.templateMaterials);

        return this.store.dispatch(new UpdateILTCourseMaterials(payload, 'materials')).pipe(
          untilDestroyed(this),
          take(1),
          map(() => {
            this.showMaterialsSaveChanges = null;
            this.cdr.markForCheck();

            return true;
          }),
        );
      }),
    );
  }

  discardMaterialsChanges(): Observable<boolean> {
    return this.store.dispatch(new DiscardILTCourseMaterialsChanges()).pipe(
      take(1),
      map(() => {
        this.templateMaterials = null;
        this.showMaterialsSaveChanges = null;
        this.cdr.markForCheck();

        return true;
      }),
    );
  }

  onDeleteCourse(id: string) {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Delete Course?',
      nzContent: DeleteCourseConfirmModalComponent,
      nzComponentParams: {
        courseId: id,
      },
      nzWidth: 660,
      nzCloseIcon: null,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Delete Course',
          danger: true,
          onClick: async (_) => {
            return this.store
              .dispatch(new DeleteCourse({ courseId: id }))
              .toPromise()
              .then(() => {
                modal.destroy();
                this.router.navigate(['admin', 'ilt-courses']);
              });
          },
        },
      ],
    });
  }

  private generateMaterials(
    iltCourse: PublishedILTCourse,
    internalRepositories: InternalRepositories,
  ): PublishedILTCourse {
    const materials = {
      masterInternalRepositories: [],
      marketplaceMaterials: [],
    };

    const updateRepositories = (userType: 'learner' | 'instructor') => (ir: InternalRepositoryMaterial) => {
      if (!ir.userType) {
        ir.userType = { configKey: userType };
      }
      ir.isMarketplaceMaterial
        ? materials.marketplaceMaterials.push(ir)
        : materials.masterInternalRepositories.push(ir);
    };

    internalRepositories.learner?.forEach(updateRepositories('learner'));
    internalRepositories.instructor?.forEach(updateRepositories('instructor'));

    const updatedIltCourse = produce(iltCourse, (draft: Draft<PublishedILTCourse>) => {
      draft.masterInternalRepositories = materials.masterInternalRepositories;
      draft.marketplaceMaterials = materials.marketplaceMaterials;
    });

    return updatedIltCourse;
  }
}
