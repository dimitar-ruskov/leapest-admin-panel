import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import produce, { Draft } from 'immer';

import {
  ApproveSPCourseLanguageVariantLearnerRegistrationRequest,
  AssignLearnersToLanguageVariant,
  ChangeSPCourseLanguageVariantDetailsTab,
  GenerateSPCourseLanguageVariantThumbnail,
  GetSPCourseLanguageVariant,
  RejectSPCourseLanguageVariantLearnerRegistrationRequest,
  RemoveSPCourseLanguageVariantLearner,
  UpdateSPCourseLanguageVariantAttribute,
  UploadLearnersFromCSVToLanguageVariant,
  UploadSPCourseLanguageVariantThumbnail,
} from './sp-course-variant-details.actions';
import { SpCourseLanguageVariantsService } from '../../../../../../../../../../../../libs/shared/src/lib/services/courses/sp-courses/sp-course-language-variants.service';
import { SpCourseVariantExamsState } from '../containers/sp-course-variant-exams/sp-course-variant-exams/sp-course-variant-exams.state';
import { SpCourseVariantMaterialsTrackingState } from '../containers/sp-course-variant-materials-tracking/sp-course-variant-materials-tracking/sp-course-variant-materials-tracking.state';
import { SpCourseVariantLearnersEnrolledState } from '../containers/sp-course-variant-learners/sp-course-variant-learners/sp-course-variant-learners-enrolled.state';
import { SpliceSPCourseLanguageVariantLearnersEnrolled } from '../containers/sp-course-variant-learners/sp-course-variant-learners/sp-course-variant-learners-enrolled.actions';
import { SpliceSPCourseLanguageVariantLearnersPending } from '../containers/sp-course-variant-learners/sp-course-variant-learners/sp-course-variant-learners-pending.actions';
import { SpCourseVariantLearnersPendingState } from '../containers/sp-course-variant-learners/sp-course-variant-learners/sp-course-variant-learners-pending.state';

import { SPCourseLanguageVariant } from '../../../../../../../../../../../../libs/shared/src/lib/models/courses/sp-courses/sp-course.model';
import {DeferredResource} from "../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {CourseThumbnailService} from "../../../../../../../../../../../../libs/shared/src/lib/utils/services";
import {
  PLACEHOLDER_COURSE_THUMBNAIL_URL
} from "../../../../../../../../../../../../libs/shared/src/lib/models/constants";


export class SpCourseVariantDetailsStateModel {
  activeTab: number;
  spCourseLanguageVariant: DeferredResource<SPCourseLanguageVariant> | null;
}

@State<SpCourseVariantDetailsStateModel>({
  name: 'spCourseVariantDetails',
  defaults: {
    activeTab: 0,
    spCourseLanguageVariant: null,
  },
  children: [
    SpCourseVariantLearnersEnrolledState,
    SpCourseVariantLearnersPendingState,
    SpCourseVariantExamsState,
    SpCourseVariantMaterialsTrackingState,
  ],
})
@Injectable()
export class SpCourseVariantDetailsState {
  @Selector([SpCourseVariantDetailsState])
  static activeTab(state: SpCourseVariantDetailsStateModel) {
    return state.activeTab;
  }

  @Selector([SpCourseVariantDetailsState])
  static spCourseLanguageVariant(state: SpCourseVariantDetailsStateModel) {
    return state.spCourseLanguageVariant;
  }

  constructor(
    private readonly spCourseLanguageVariantsService: SpCourseLanguageVariantsService,
    private readonly courseThumbnailService: CourseThumbnailService,
  ) {}

  @Action(ChangeSPCourseLanguageVariantDetailsTab)
  changeSPCourseLanguageVariantDetailsTab(
    { patchState }: StateContext<SpCourseVariantDetailsStateModel>,
    action: ChangeSPCourseLanguageVariantDetailsTab,
  ) {
    const { activeTab } = action.payload;

    patchState({ activeTab });
  }

  @Action(GetSPCourseLanguageVariant)
  getSPCourseLanguageVariant(
    { patchState }: StateContext<SpCourseVariantDetailsStateModel>,
    action: GetSPCourseLanguageVariant,
  ) {
    const { id } = action.payload;

    return this.spCourseLanguageVariantsService.getSPCourseLanguageVariant(id).pipe(
      tap((resource: DeferredResource<SPCourseLanguageVariant>) => {
        patchState({ spCourseLanguageVariant: resource });
      }),
    );
  }

  @Action(UpdateSPCourseLanguageVariantAttribute)
  updateSPCourseAttribute(
    { patchState, getState }: StateContext<SpCourseVariantDetailsStateModel>,
    action: UpdateSPCourseLanguageVariantAttribute,
  ) {
    const { updatedLanguageVariant, attribute } = action.payload;
    let { props } = action.payload;
    const { spCourseLanguageVariant } = getState();
    const currentResponse = spCourseLanguageVariant.response;

    return this.spCourseLanguageVariantsService
      .updateSPCourseLanguageVariantAttribute(updatedLanguageVariant, attribute)
      .pipe(
        tap((resource: DeferredResource<SPCourseLanguageVariant>) => {
          if (resource.isSuccess) {
            const response = resource.response;

            const payload = produce(currentResponse, (draft) => {
              if (!props || props.length === 0) {
                props = [attribute];
              }

              props.forEach((updatedName) => {
                const prop = updatedName.split('.');

                if (prop.length === 1) {
                  draft[prop[0]] = response[updatedName];
                } else if (prop.length === 2) {
                  draft[prop[0]][prop[1]] = response[prop[0]][prop[1]];
                }
              });
            });

            patchState({ spCourseLanguageVariant: DeferredResource.success(payload) });
          }
        }),
      );
  }

  @Action(GenerateSPCourseLanguageVariantThumbnail)
  generateSelfPacedCourseThumbnail(
    { patchState, getState }: StateContext<SpCourseVariantDetailsStateModel>,
    action: GenerateSPCourseLanguageVariantThumbnail,
  ) {
    const { courseId } = action.payload;
    const { spCourseLanguageVariant } = getState();

    return this.courseThumbnailService.generateCourseThumbnail({ id: courseId }).pipe(
      tap((res) => {
        if (!res.isPending) {
          const payload = produce(spCourseLanguageVariant.response, (draft: SPCourseLanguageVariant) => {
            draft.course.thumbnailUrl = PLACEHOLDER_COURSE_THUMBNAIL_URL;
          });

          patchState({ spCourseLanguageVariant: DeferredResource.success(payload) });
        }
      }),
    );
  }

  @Action(UploadSPCourseLanguageVariantThumbnail)
  uploadSelfPacedCourseThumbnail(
    { patchState, getState }: StateContext<SpCourseVariantDetailsStateModel>,
    action: UploadSPCourseLanguageVariantThumbnail,
  ) {
    const { courseId, s3BucketData } = action.payload;
    const { spCourseLanguageVariant } = getState();

    return this.courseThumbnailService.uploadCourseThumbnail(courseId, s3BucketData).pipe(
      tap((res) => {
        if (res.isSuccess) {
          const response = res.response;
          const payload = produce(spCourseLanguageVariant.response, (draft: SPCourseLanguageVariant) => {
            draft.course.thumbnailUrl = response.thumbnailUrl;
            draft.course.thumbnailKey = response.thumbnailKey;
          });

          patchState({ spCourseLanguageVariant: DeferredResource.success(payload) });
        }
      }),
    );
  }

  @Action(AssignLearnersToLanguageVariant)
  assignLearnersToLanguageVariant(
    { patchState, getState, dispatch }: StateContext<SpCourseVariantDetailsStateModel>,
    { payload }: AssignLearnersToLanguageVariant,
  ) {
    const { spCourseLanguageVariant } = getState();
    const { languageVariantId, data } = payload;

    return this.spCourseLanguageVariantsService.assignSPCourseLanguageVariantLearner(languageVariantId, data).pipe(
      tap((resource) => {
        if (resource.isSuccess) {
          const response = resource.response;
          const updatedLanguageVariant = produce(
            spCourseLanguageVariant.response,
            (draft: Draft<SPCourseLanguageVariant>) => {
              draft.enrolledLearnerCounter = response.enrolledLearners;
            },
          );

          patchState({ spCourseLanguageVariant: DeferredResource.success(updatedLanguageVariant) });
        }
      }),
    );
  }

  @Action(UploadLearnersFromCSVToLanguageVariant)
  uploadLearnersFromCSVToEvent(
    { patchState, getState, dispatch }: StateContext<SpCourseVariantDetailsStateModel>,
    { payload }: UploadLearnersFromCSVToLanguageVariant,
  ) {
    const { spCourseLanguageVariant } = getState();
    const { languageVariantId, data } = payload;

    return this.spCourseLanguageVariantsService.uploadLearnersFromCSVToEvent(languageVariantId, data).pipe(
      tap((resource) => {
        if (resource.isSuccess) {
          const response = resource.response;
          const updatedLanguageVariant = produce(
            spCourseLanguageVariant.response,
            (draft: Draft<SPCourseLanguageVariant>) => {
              draft.enrolledLearnerCounter = response.enrolledLearners;
            },
          );

          patchState({ spCourseLanguageVariant: DeferredResource.success(updatedLanguageVariant) });
        }
      }),
    );
  }

  @Action(RemoveSPCourseLanguageVariantLearner)
  removeSPCourseLanguageVariantLearner(
    { patchState, getState, dispatch }: StateContext<SpCourseVariantDetailsStateModel>,
    action: RemoveSPCourseLanguageVariantLearner,
  ) {
    const { id, learners } = action.payload;
    const { spCourseLanguageVariant } = getState();

    return this.spCourseLanguageVariantsService.removeSPCourseLanguageVariantLearner(id, learners).pipe(
      tap((resource) => {
        if (resource.isSuccess) {
          const response = resource.response;
          const updatedLanguageVariant = produce(
            spCourseLanguageVariant.response,
            (draft: Draft<SPCourseLanguageVariant>) => {
              draft.enrolledLearnerCounter = response.enrolledLearners;
            },
          );

          patchState({ spCourseLanguageVariant: DeferredResource.success(updatedLanguageVariant) });
          dispatch(new SpliceSPCourseLanguageVariantLearnersEnrolled({ learnerUserNames: learners }));
        }
      }),
    );
  }

  @Action(RejectSPCourseLanguageVariantLearnerRegistrationRequest)
  rejectSPCourseLanguageVariantLearnerRegistrationRequest(
    { dispatch, getState, patchState }: StateContext<SpCourseVariantDetailsStateModel>,
    action: RejectSPCourseLanguageVariantLearnerRegistrationRequest,
  ) {
    const { spCourseLanguageVariant } = getState();
    const currentVariant = spCourseLanguageVariant.response;

    return this.spCourseLanguageVariantsService.rejectSPCourseLanguageVariantLearner(action.payload).pipe(
      tap((resource) => {
        if (resource.isSuccess) {
          const updatedLanguageVariant = produce(currentVariant, (draft: Draft<SPCourseLanguageVariant>) => {
            // Backend doesn't return updated pending learners count, so we try to update it locally
            draft.classEvent.pendingLearners = currentVariant.classEvent.pendingLearners - 1;
          });

          patchState({ spCourseLanguageVariant: DeferredResource.success(updatedLanguageVariant) });
          dispatch(new SpliceSPCourseLanguageVariantLearnersPending({ learnerUserNames: [action.payload.username] }));
        }
      }),
    );
  }

  @Action(ApproveSPCourseLanguageVariantLearnerRegistrationRequest)
  approveSPCourseLanguageVariantLearnerRegistrationRequest(
    { dispatch, getState, patchState }: StateContext<SpCourseVariantDetailsStateModel>,
    action: ApproveSPCourseLanguageVariantLearnerRegistrationRequest,
  ) {
    const { spCourseLanguageVariant } = getState();
    const currentVariant = spCourseLanguageVariant.response;

    return this.spCourseLanguageVariantsService.approveSPCourseLanguageVariantLearner(action.payload).pipe(
      tap((resource) => {
        if (resource.isSuccess) {
          const updatedLanguageVariant = produce(currentVariant, (draft: Draft<SPCourseLanguageVariant>) => {
            // Backend doesn't return updated pending learners count, so we try to update it locally
            draft.classEvent.pendingLearners = currentVariant.classEvent.pendingLearners - 1;
          });

          patchState({ spCourseLanguageVariant: DeferredResource.success(updatedLanguageVariant) });
          dispatch(new SpliceSPCourseLanguageVariantLearnersPending({ learnerUserNames: [action.payload.username] }));
        }
      }),
    );
  }
}
