import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { DraftILTCoursesState } from '../state/draft-ilt-courses.state';
import {
  ChangeDraftILTCoursesPaginationParams,
  DeleteDraftILTCourse,
  GetDraftILTCourses,
  ResetDraftILTCoursesState,
} from '../state/draft-ilt-courses.actions';

import {DraftILTCourse} from "../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {createPageableFromTableQueryParams} from "../../../../../../../../../libs/shared/src/lib/utils/common";

@Component({
  selector: 'leap-draft-ilt-courses-list',
  templateUrl: './draft-ilt-courses-list.component.html',
  styleUrls: ['./draft-ilt-courses-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraftIltCoursesListComponent implements OnInit {
  @Select(DraftILTCoursesState.loading)
  loading$: Observable<boolean>;

  @Select(DraftILTCoursesState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(DraftILTCoursesState.iltCourses)
  iltCourses$: Observable<DraftILTCourse[]>;

  @Select(DraftILTCoursesState.pageSize)
  pageSize$: Observable<number>;

  @Select(DraftILTCoursesState.total)
  total$: Observable<number>;

  @Select(DraftILTCoursesState.pageIndex)
  pageIndex$: Observable<number>;

  trackByFn: TrackByFunction<DraftILTCourse> = (index, item) => item.id;

  constructor(private readonly store: Store, private readonly modalService: NzModalService) {}

  ngOnInit(): void {
    this.store.dispatch(new ResetDraftILTCoursesState());
  }

  onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeDraftILTCoursesPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetDraftILTCourses(),
    ]);
  }

  deleteDraft(event: MouseEvent, course: DraftILTCourse): void {
    event.stopPropagation();
    const description = `You are about to delete the course ${course.name} from this draft.
                         This action cannot be undone. How do you wish to proceed?`;
    this.modalService.confirm({
      nzTitle: 'Delete Course Draft?',
      nzContent: description,
      nzWidth: '660px',
      nzOkText: 'Delete Course',
      nzOkDanger: true,
      nzOnOk: async () => this.store.dispatch(new DeleteDraftILTCourse({ id: course.id })).toPromise(),
      nzCancelText: 'Cancel',
    });
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([new ChangeDraftILTCoursesPaginationParams({ pageable }), new GetDraftILTCourses()]);
  }
}
