import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import produce from 'immer';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { InternalRepositoryService } from '../../../service/internal-repository.service';
import { InternalRepositoryCoursesState } from './internal-repository-courses.state';
import {
  GetInternalRepositoryDetails,
  UpdateAssessmentDetails,
  UpdateParentInternalRepository,
} from './internal-repository-details.actions';
import { InternalRepositoryVariantsState } from './internal-repository-variants.state';

import {DeferredResource} from "../../../../../../../../../libs/shared/src/lib/utils/common";
import {InternalRepository} from "../../../../../../../../../libs/shared/src/lib/models/interfaces";

export class InternalRepositoryDetailsStateModel {
  internalRepository: DeferredResource<InternalRepository> | null;
}
@State<InternalRepositoryDetailsStateModel>({
  name: 'internalRepositoryDetails',
  defaults: {
    internalRepository: null,
  },
  children: [InternalRepositoryVariantsState, InternalRepositoryCoursesState],
})
@Injectable()
export class InternalRepositoryDetailsState {
  constructor(private readonly service: InternalRepositoryService) {}

  @Selector([InternalRepositoryDetailsState])
  static internalRepository(state: InternalRepositoryDetailsStateModel) {
    return state.internalRepository;
  }

  @Action(GetInternalRepositoryDetails)
  getActiveSelfPacedCourse(
    { patchState }: StateContext<InternalRepositoryDetailsStateModel>,
    action: GetInternalRepositoryDetails,
  ) {
    const sku = action.payload;

    return this.service.getInternalRepositoryDetails(sku).pipe(
      tap((internalRepository: DeferredResource<InternalRepository>) => {
        patchState({ internalRepository });
      }),
    );
  }

  @Action(UpdateParentInternalRepository)
  updateParentInternalRepository(
    { patchState, getState }: StateContext<InternalRepositoryDetailsStateModel>,
    action: UpdateParentInternalRepository,
  ): Observable<DeferredResource<InternalRepository>> {
    const { internalRepository } = getState();
    const updatedInternalRepository = action.payload.internalRepository;
    const key = action.payload.key;
    return this.service.updateParentInternalRepository(updatedInternalRepository).pipe(
      tap((response: DeferredResource<InternalRepository>) => {
        if (response?.isSuccess) {
          const newIR = produce(internalRepository.response, (ir: InternalRepository) => {
            ir[key] = response.response[key];
          });
          patchState({ internalRepository: DeferredResource.success(newIR) });
        }
      }),
    );
  }

  @Action(UpdateAssessmentDetails)
  updateAssessmentDetails(
    { patchState, getState }: StateContext<InternalRepositoryDetailsStateModel>,
    action: UpdateAssessmentDetails,
  ): Observable<DeferredResource<InternalRepository>> {
    const { internalRepository } = getState();
    const updatedInternalRepository = action.payload.internalRepository;
    const key = action.payload.key;
    return this.service.updateParentInternalRepository(updatedInternalRepository).pipe(
      tap((response: DeferredResource<InternalRepository>) => {
        if (response?.isSuccess) {
          const newIR = produce(internalRepository.response, (ir: InternalRepository) => {
            ir.assessmentDetails[key] = response.response.assessmentDetails[key];
          });
          patchState({ internalRepository: DeferredResource.success(newIR) });
        }
      }),
    );
  }
}
