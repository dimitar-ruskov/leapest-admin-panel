import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { ChangeInternalRepositoryCoursesPaginationParams, GetInternalRepositoryCourses, ResetInternalRepositoryCoursesState } from './internal-repository-courses.actions';

import { InternalRepositoryCourseListItem } from '../../../../../../../../../../../libs/shared/src/lib/models/internal-repo/internal-repository-course-list-item.model';
import { InternalRepositoryService } from '../../../../../../../../../../../libs/shared/src/lib/services/repository/internal/internal-repository.service';
import {DeferredResource} from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {DEFAULT_INITIAL_PAGINATION_PARAMS} from "../../../../../../../../../../../libs/shared/src/lib/models/constants";
import {IPageable} from "../../../../../../../../../../../libs/shared/src/lib/models";

export class InternalRepositoryCoursesStateModel {
    loading: boolean;
    internalRepositoryCourses: InternalRepositoryCourseListItem[];
    total: number;
    paginationParams: IPageable;
}

@State<InternalRepositoryCoursesStateModel>({
    name: 'internalRepositoryCourses',
    defaults: {
        loading: false,
        internalRepositoryCourses: [],
        total: 0,
        paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
    }
})
@Injectable()
export class InternalRepositoryCoursesState {

    @Selector()
    static loading(state: InternalRepositoryCoursesStateModel) {
        return state.loading;
    }

    @Selector()
    static internalRepositoryCourses(state: InternalRepositoryCoursesStateModel) {
        return state.internalRepositoryCourses;
    }

    @Selector()
    static total(state: InternalRepositoryCoursesStateModel) {
        return state.total;
    }

    @Selector()
    static searchPhrase(state: InternalRepositoryCoursesStateModel) {
        return state.paginationParams.filter;
    }

    @Selector()
    static pageIndex(state: InternalRepositoryCoursesStateModel) {
        return state.paginationParams.page;
    }

    @Selector()
    static pageSize(state: InternalRepositoryCoursesStateModel) {
        return state.paginationParams.limit;
    }


    constructor(
        private readonly service: InternalRepositoryService
    ) {
    }

    @Action(GetInternalRepositoryCourses)
    getInternalRepositoryCourses({ patchState, getState }: StateContext<InternalRepositoryCoursesStateModel>,
        action: GetInternalRepositoryCourses
    ) {
        const { sku } = action.payload;
        const { paginationParams } = getState();

        return this.service.getInternalRepositoryCourses(sku, paginationParams)
            .pipe(tap((resource: DeferredResource<{ data: InternalRepositoryCourseListItem[], flags: { size: number } }>) => {
                patchState({ loading: resource.isPending });

                if (resource.isSuccess) {
                    patchState({ internalRepositoryCourses: resource.response.data, total: resource.response.flags.size });
                }
            }));
    }

    @Action(ChangeInternalRepositoryCoursesPaginationParams)
    changeInternalRepositoryCoursesPaginationParams({ patchState, getState }: StateContext<InternalRepositoryCoursesStateModel>,
        { payload }: ChangeInternalRepositoryCoursesPaginationParams) {
        const { paginationParams } = getState();

        patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
    }
    @Action(ResetInternalRepositoryCoursesState)
    resetActiveSPCoursesState({ patchState }: StateContext<InternalRepositoryCoursesStateModel>) {
        patchState({
            loading: false,
            internalRepositoryCourses: [],
            total: 0,
            paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
        });
    }
}
