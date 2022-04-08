import {IPageable} from "../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetInternalRepositoryCourses {
    static readonly type = '[AP Internal Repository Courses] Get Internal Repository Courses';

    constructor(public readonly payload: { sku: string }) { }
}

export class ChangeInternalRepositoryCoursesPaginationParams {
    static readonly type = '[AP Internal Repository Courses] Change Internal Repository Courses Pagination Params';

    constructor(public readonly payload: { pageable: IPageable }) {
    }
}
export class ResetInternalRepositoryCoursesState {
    static readonly type = '[AP Internal Repository Courses] Reset Internal Repository Courses State';
}
