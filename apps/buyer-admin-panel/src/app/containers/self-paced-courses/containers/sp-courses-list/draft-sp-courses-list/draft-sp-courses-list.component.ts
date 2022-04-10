import { Component, ChangeDetectionStrategy, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzModalService } from 'ng-zorro-antd/modal';

import { DraftSpCoursesListState } from '../state/draft-sp-courses-list/draft-sp-courses-list.state';
import {
  ChangeDraftSPCoursesPaginationParams,
  DeleteDraftSPCourse,
  GetDraftSelfPacedCourses,
  ResetDraftSPCoursesState,
} from '../state/draft-sp-courses-list/draft-sp-courses-list.actions';

import { DraftSelfPacedCourse } from '../../../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course.model';
import {createPageableFromTableQueryParams} from "../../../../../../../../../libs/shared/src/lib/utils/common";

@Component({
  selector: 'leap-draft-sp-courses-list',
  templateUrl: './draft-sp-courses-list.component.html',
  styleUrls: ['./draft-sp-courses-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraftSpCoursesListComponent implements OnInit {
  @Select(DraftSpCoursesListState.loading)
  loading$: Observable<boolean>;

  @Select(DraftSpCoursesListState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(DraftSpCoursesListState.selfPacedCourses)
  selfPacedCourses$: Observable<DraftSelfPacedCourse[]>;

  @Select(DraftSpCoursesListState.pageSize)
  pageSize$: Observable<number>;

  @Select(DraftSpCoursesListState.total)
  total$: Observable<number>;

  @Select(DraftSpCoursesListState.pageIndex)
  pageIndex$: Observable<number>;

  trackByFn: TrackByFunction<DraftSelfPacedCourse> = (index, item) => item.id;

  constructor(private readonly store: Store, private readonly modalService: NzModalService) {}

  ngOnInit(): void {
    this.store.dispatch(new ResetDraftSPCoursesState());
  }

  onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeDraftSPCoursesPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetDraftSelfPacedCourses(),
    ]);
  }

  deleteDraft(event: MouseEvent, course: DraftSelfPacedCourse): void {
    event.stopPropagation();
    const description = `You are about to delete the course ${course.name} from this draft.
                         This action cannot be undone. How do you wish to proceed?`;
    this.modalService.confirm({
      nzTitle: 'Delete Course Draft?',
      nzContent: description,
      nzWidth: '660px',
      nzOkText: 'Delete Course',
      nzOkDanger: true,
      nzOnOk: async () => this.store.dispatch(new DeleteDraftSPCourse({ id: course.id })).toPromise(),
      nzCancelText: 'Cancel',
    });
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([new ChangeDraftSPCoursesPaginationParams({ pageable }), new GetDraftSelfPacedCourses()]);
  }
}
