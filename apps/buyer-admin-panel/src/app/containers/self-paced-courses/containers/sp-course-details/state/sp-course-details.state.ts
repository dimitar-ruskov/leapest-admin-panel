import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import produce from 'immer';

import { SpCoursesService } from '../../../../../../../../../libs/shared/src/lib/services/courses/sp-courses/sp-courses.service';
import { SpCourseVariantsState } from '../containers/sp-course-variants/state/sp-course-variants.state';
import {
  ChangeSelfPacedCourseDetailsTab,
  GenerateSelfPacedCourseThumbnail,
  GetActiveSelfPacedCourse,
  UpdateSPCourseAttribute,
  UploadSelfPacedCourseThumbnail,
  PublishToLxp,
  PublishToLxpByDomain
} from './sp-course-details.actions';

import { ActiveSelfPacedCourse } from '../../../../../../../../../libs/shared/src/lib/models/courses/sp-courses/sp-course.model';
import {DeferredResource} from "../../../../../../../../../libs/shared/src/lib/utils/common";
import {CourseThumbnailService} from "../../../../../../../../../libs/shared/src/lib/utils/services";
import {PLACEHOLDER_COURSE_THUMBNAIL_URL} from "../../../../../../../../../libs/shared/src/lib/models/constants";
import {
  IltCourseDetailsStateModel
} from "../../../../ilt-courses/containers/ilt-course-details/state/ilt-course-details.state";
import {
  MasterInternalRepository,
  PublishedCourseToLXP
} from "../../../../../../../../../libs/shared/src/lib/models";
import {
  CourseLxpSettingsService
} from "../../../../../../../../../libs/shared/src/lib/services/publishing/course-lxp-settings.service";
import {NzMessageService} from "ng-zorro-antd/message";

export class SpCourseDetailsStateModel {
  activeTab: number;
  selfPacedCourse: DeferredResource<ActiveSelfPacedCourse> | null;
}

@State<SpCourseDetailsStateModel>({
  name: 'spCourseDetails',
  defaults: {
    activeTab: 0,
    selfPacedCourse: null,
  },
  children: [SpCourseVariantsState],
})
@Injectable()
export class SpCourseDetailsState {
  constructor(
    private readonly selfPacedCoursesService: SpCoursesService,
    private readonly courseThumbnailService: CourseThumbnailService,
    private readonly courseLxpSettingsService: CourseLxpSettingsService,
    private readonly messageService: NzMessageService,
  ) {}

  @Selector([SpCourseDetailsState])
  static activeTab(state: SpCourseDetailsStateModel) {
    return state.activeTab;
  }

  @Selector([SpCourseDetailsState])
  static selfPacedCourse(state: SpCourseDetailsStateModel) {
    return state.selfPacedCourse;
  }

  @Selector([SpCourseDetailsState])
  static selfPacedCourseMaterials(state: SpCourseDetailsStateModel): MasterInternalRepository[] {
    const response: ActiveSelfPacedCourse = state.selfPacedCourse.response;

    if (response) {
      const materials = response.masterInternalRepositories;

      return materials.map((material) => ({
        languages: material.internalRepositoryDTOs.map((i) => i.language),
        types: material.internalRepositoryDTOs.map((i) => i.type),
        name: material.name,
        id: material.id,
        sku: material.sku,
      }));
    }

    return [];
  }

  @Action(ChangeSelfPacedCourseDetailsTab)
  changeSelfPacedCourseDetailsTab(
    { patchState }: StateContext<SpCourseDetailsStateModel>,
    action: ChangeSelfPacedCourseDetailsTab,
  ) {
    const { activeTab } = action.payload;

    patchState({ activeTab });
  }

  @Action(GetActiveSelfPacedCourse)
  getActiveSelfPacedCourse(
    { patchState }: StateContext<SpCourseDetailsStateModel>,
    action: GetActiveSelfPacedCourse,
  ) {
    const { id } = action.payload;

    return this.selfPacedCoursesService.getActiveSelfPacedCourse(id).pipe(
      tap((resource: DeferredResource<ActiveSelfPacedCourse>) => {
        patchState({ selfPacedCourse: resource });
      }),
    );
  }

  @Action(UpdateSPCourseAttribute)
  updateSPCourseAttribute(
    { patchState, getState }: StateContext<SpCourseDetailsStateModel>,
    action: UpdateSPCourseAttribute,
  ) {
    const { updatedCourse, attribute } = action.payload;
    let { props } = action.payload;
    const { selfPacedCourse } = getState();

    return this.selfPacedCoursesService.updateSPCourseAttribute(updatedCourse, attribute).pipe(
      tap((resource: DeferredResource<ActiveSelfPacedCourse>) => {
        if (resource.isSuccess) {
          const payload = produce(selfPacedCourse.response, (draft) => {
            if (!props || props.length === 0) {
              props = [attribute];
            }

            props.forEach((updatedName) => {
              draft[updatedName] = resource.response[updatedName];
            });
          });

          patchState({ selfPacedCourse: DeferredResource.success(payload) });
        }
      }),
    );
  }

  @Action(GenerateSelfPacedCourseThumbnail)
  generateSelfPacedCourseThumbnail(
    { patchState, getState }: StateContext<SpCourseDetailsStateModel>,
    action: GenerateSelfPacedCourseThumbnail,
  ) {
    const { courseId } = action.payload;
    const { selfPacedCourse } = getState();

    return this.courseThumbnailService.generateCourseThumbnail({ id: courseId }).pipe(
      tap((res) => {
        if (!res.isPending) {
          const payload = produce(selfPacedCourse.response, (draft: ActiveSelfPacedCourse) => {
            draft.thumbnailUrl = PLACEHOLDER_COURSE_THUMBNAIL_URL;
          });

          patchState({ selfPacedCourse: DeferredResource.success(payload) });
        }
      }),
    );
  }

  @Action(UploadSelfPacedCourseThumbnail)
  uploadSelfPacedCourseThumbnail(
    { patchState, getState }: StateContext<SpCourseDetailsStateModel>,
    action: UploadSelfPacedCourseThumbnail,
  ) {
    const { courseId, s3BucketData } = action.payload;
    const { selfPacedCourse } = getState();

    return this.courseThumbnailService.uploadCourseThumbnail(courseId, s3BucketData).pipe(
      tap((res) => {
        if (res.isSuccess) {
          const response = res.response;
          const payload = produce(selfPacedCourse.response, (draft: ActiveSelfPacedCourse) => {
            draft.thumbnailUrl = response.thumbnailUrl;
            draft.thumbnailKey = response.thumbnailKey;
          });

          patchState({ selfPacedCourse: DeferredResource.success(payload) });
        }
      }),
    );
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
