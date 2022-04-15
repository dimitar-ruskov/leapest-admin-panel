import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import produce, { Draft } from 'immer';

import { IltCoursesService } from '../../../services/ilt-courses.service';
import { IltCourseReviewsState } from '../containers/ilt-course-reviews/state/ilt-course-reviews.state';
import { IltCourseDetailsNotificationsState } from '../containers/ilt-course-notifications/state/ilt-course-details-notifications.state';
import { IltCourseEventsBulkUploadsState } from '../containers/ilt-course-events-tab/ilt-course-events-bulk/state/ilt-course-events-bulk.state';
import { IltCourseEventsCommonState } from '../containers/ilt-course-events-tab/state/ilt-course-events-common.state';
import {
  ChangeILTCourseDetailsTab,
  DeleteCourse,
  GenerateILTCourseThumbnail,
  GetILTCourse,
  PublishToLxp,
  UpdateILTCourseAttribute,
  UploadILTCourseThumbnail,
  DiscardILTCourseAgendaChanges,
  DiscardILTCourseMaterialsChanges,
  UpdateILTCourseAgenda,
  UpdateILTCourseMaterials,
  PublishToLxpByDomain
} from './ilt-course-details.actions';
import {
  ILTEvent,
  MasterInternalRepository, PublishedCourseToLXP,
  PublishedILTCourse
} from "../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {DeferredResource} from "../../../../../../../../../libs/shared/src/lib/utils/common";
import {CourseThumbnailService} from "../../../../../../../../../libs/shared/src/lib/utils/services";
import {PLACEHOLDER_COURSE_THUMBNAIL_URL} from "../../../../../../../../../libs/shared/src/lib/models/constants";
import {
  CourseLxpSettingsService
} from "../../../../../../../../../libs/shared/src/lib/utils/services/course-lxp-settings.service";
import {NzMessageService} from "ng-zorro-antd/message";

export class IltCourseDetailsStateModel {
  activeTab: number;
  iltCourse: DeferredResource<PublishedILTCourse> | null;
}

@State<IltCourseDetailsStateModel>({
  name: 'iltCourseDetails',
  defaults: {
    activeTab: 0,
    iltCourse: null,
  },
  children: [
    IltCourseReviewsState,
    IltCourseDetailsNotificationsState,
    IltCourseEventsCommonState,
    IltCourseEventsBulkUploadsState,
  ],
})
@Injectable()
export class IltCourseDetailsState {
  @Selector([IltCourseDetailsState])
  static activeTab(state: IltCourseDetailsStateModel) {
    return state.activeTab;
  }

  @Selector([IltCourseDetailsState])
  static iltCourse(state: IltCourseDetailsStateModel) {
    return state.iltCourse;
  }

  @Selector([IltCourseDetailsState])
  static iltCourseMaterials(
    state: IltCourseDetailsStateModel,
  ): {
    learner: MasterInternalRepository[];
    instructor: MasterInternalRepository[];
  } {
    const internalRepositories = {
      learner: [],
      instructor: [],
    };
    const response: PublishedILTCourse = state.iltCourse.response;

    if (response) {
      const materials = response.masterInternalRepositories;

      materials.forEach((material) => {
        const userType = material.userType.configKey;
        const mapped = {
          languages: material.internalRepositoryDTOs.map((i) => i.language),
          types: material.internalRepositoryDTOs.map((i) => i.type),
          name: material.name,
          id: material.id,
          sku: material.sku,
        };

        internalRepositories[userType].push(mapped);
      });
    }

    return internalRepositories;
  }

  constructor(
    private readonly iltCoursesService: IltCoursesService,
    private readonly courseThumbnailService: CourseThumbnailService,
    private readonly courseLxpSettingsService: CourseLxpSettingsService,
    private readonly messageService: NzMessageService,
  ) {}

  @Action(ChangeILTCourseDetailsTab)
  changeILTCourseDetailsTab(
    { patchState }: StateContext<IltCourseDetailsStateModel>,
    { payload: { activeTab } }: ChangeILTCourseDetailsTab,
  ) {
    patchState({ activeTab });
  }

  @Action(GetILTCourse)
  getILTCourse({ patchState }: StateContext<IltCourseDetailsStateModel>, { payload: { id } }: GetILTCourse) {
    return this.iltCoursesService.getILTCourse(id).pipe(
      tap((resource: DeferredResource<PublishedILTCourse>) => {
        patchState({ iltCourse: resource });
      }),
    );
  }

  @Action(UpdateILTCourseAttribute)
  updateILTCourseAttribute(
    { patchState, getState }: StateContext<IltCourseDetailsStateModel>,
    action: UpdateILTCourseAttribute,
  ) {
    const { updatedCourse, attribute } = action.payload;
    let { props } = action.payload;
    const { iltCourse } = getState();

    return this.iltCoursesService.updateILTCourseAttribute(updatedCourse, attribute).pipe(
      tap((resource: DeferredResource<PublishedILTCourse>) => {
        if (resource.isSuccess) {
          const payload = produce(iltCourse.response, (draft: Draft<PublishedILTCourse>) => {
            if (!props || props.length === 0) {
              props = [attribute];
            }

            props.forEach((updatedName) => {
              if (updatedName === 'certificate-template') {
                draft.participationCertificate = resource.response.participationCertificate;
              } else {
                draft[updatedName] = resource.response[updatedName];
              }
            });
          });

          patchState({ iltCourse: DeferredResource.success(payload) });
        }
      }),
    );
  }

  @Action(GenerateILTCourseThumbnail)
  generateILTCourseThumbnail(
    { patchState, getState }: StateContext<IltCourseDetailsStateModel>,
    action: GenerateILTCourseThumbnail,
  ) {
    const { courseId } = action.payload;
    const { iltCourse } = getState();

    return this.courseThumbnailService.generateCourseThumbnail({ id: courseId }).pipe(
      tap((res) => {
        if (!res.isPending) {
          const payload = produce(iltCourse.response, (draft: Draft<PublishedILTCourse>) => {
            draft.thumbnailUrl = PLACEHOLDER_COURSE_THUMBNAIL_URL;
          });

          patchState({ iltCourse: DeferredResource.success(payload) });
        }
      }),
    );
  }

  @Action(UploadILTCourseThumbnail)
  uploadILTCourseThumbnail(
    { patchState, getState }: StateContext<IltCourseDetailsStateModel>,
    action: UploadILTCourseThumbnail,
  ) {
    const { courseId, s3BucketData } = action.payload;
    const { iltCourse } = getState();

    return this.courseThumbnailService.uploadCourseThumbnail(courseId, s3BucketData).pipe(
      tap((res) => {
        if (res.isSuccess) {
          const response = res.response;
          const payload = produce(iltCourse.response, (draft: Draft<PublishedILTCourse>) => {
            draft.thumbnailUrl = response.thumbnailUrl;
            draft.thumbnailKey = response.thumbnailKey;
          });

          patchState({ iltCourse: DeferredResource.success(payload) });
        }
      }),
    );
  }

  @Action(UpdateILTCourseAgenda)
  updateILTCourseAgenda(
    { patchState, getState }: StateContext<IltCourseDetailsStateModel>,
    { data, key }: UpdateILTCourseAgenda,
  ) {
    const { iltCourse } = getState();

    return this.iltCoursesService.updateILTCourseAttribute(data, key).pipe(
      tap((res: DeferredResource<PublishedILTCourse>) => {
        if (res.isSuccess) {
          const payload = produce(iltCourse.response, (a: ILTEvent) => {
            a.hierarchicalAgenda = res.response.hierarchicalAgenda;
          });

          patchState({ iltCourse: DeferredResource.success(payload) });
        }
      }),
    );
  }

  @Action(DiscardILTCourseAgendaChanges)
  discardILTCourseAgendaChanges({ patchState, getState }: StateContext<IltCourseDetailsStateModel>) {
    const { iltCourse } = getState();
    const payload = produce(iltCourse.response, (draft) => {
      draft.hierarchicalAgenda = [...iltCourse.response.hierarchicalAgenda];
    });

    patchState({ iltCourse: DeferredResource.success(payload) });
  }

  @Action(UpdateILTCourseMaterials)
  updateILTCourseMaterials(
    { patchState, getState }: StateContext<IltCourseDetailsStateModel>,
    { data, key }: UpdateILTCourseMaterials,
  ) {
    const { iltCourse } = getState();

    return this.iltCoursesService.updateILTCourseAttribute(data, key).pipe(
      tap((res: DeferredResource<PublishedILTCourse>) => {
        if (res.isSuccess) {
          const payload = produce(iltCourse.response, (draft) => {
            draft.masterInternalRepositories = res.response.masterInternalRepositories;
            draft.marketplaceMaterials = res.response.marketplaceMaterials;
          });

          patchState({ iltCourse: DeferredResource.success(payload) });
        }
      }),
    );
  }

  @Action(DiscardILTCourseMaterialsChanges)
  discardILTCourseMaterialsChanges({ patchState, getState }: StateContext<IltCourseDetailsStateModel>) {
    const { iltCourse } = getState();
    const payload = produce(iltCourse.response, (draft) => {
      draft.masterInternalRepositories = iltCourse.response.masterInternalRepositories;
      draft.marketplaceMaterials = iltCourse.response.marketplaceMaterials;
    });

    patchState({ iltCourse: DeferredResource.success(payload) });
  }

  @Action(DeleteCourse)
  deleteCourse({ patchState, getState }: StateContext<IltCourseDetailsStateModel>, { payload }: DeleteCourse) {
    return this.iltCoursesService.deleteCourse(payload.courseId);
  }

  @Action(PublishToLxp)
  PublishToLxp({ patchState, getState }: StateContext<IltCourseDetailsStateModel>, action: PublishToLxp) {
    return this.courseLxpSettingsService.publishToLxp(action.payload);
  }

  @Action(PublishToLxpByDomain)
  PublishToLxpByDomain({ patchState, getState }: StateContext<IltCourseDetailsStateModel>, action: PublishToLxp) {
    return this.courseLxpSettingsService.publishToLxpByDomain(action.payload).pipe(
      tap((response: DeferredResource<PublishedCourseToLXP[]>) => {
        if (response.isSuccess) {
          this.messageService.success('Your course will be published soon! Please refresh page, to see changes!');
        } else if (response.error) {
          this.messageService.error('Failed to publish course!');
        }
      }),
    );
  }
}
