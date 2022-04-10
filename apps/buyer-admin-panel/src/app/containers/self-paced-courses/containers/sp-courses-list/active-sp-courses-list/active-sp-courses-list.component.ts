import { Component, ChangeDetectionStrategy, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { NzTableQueryParams } from 'ng-zorro-antd/table/ng-zorro-antd-table';

import {
  ChangeActiveSPCoursesPaginationParams,
  GetActiveSelfPacedCourses,
  ResetActiveSPCoursesState,
} from '../state/active-sp-courses-list/active-sp-courses-list.actions';
import { ActiveSpCoursesListState } from '../state/active-sp-courses-list/active-sp-courses-list.state';

import { CreateSpCourseVariantHandlerService } from '../../../services/create-sp-course-variant-handler.service';
import { ActiveSelfPacedCourse } from '../../../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course.model';
import {createPageableFromTableQueryParams} from "../../../../../../../../../libs/shared/src/lib/utils/common";
import {EnvironmentService} from "../../../../../../../../../libs/shared/src/lib/utils/services/common";

@Component({
  selector: 'leap-active-sp-courses-list',
  templateUrl: './active-sp-courses-list.component.html',
  styleUrls: ['./active-sp-courses-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveSpCoursesListComponent implements OnInit {
  @Select(ActiveSpCoursesListState.loading)
  loading$: Observable<boolean>;

  @Select(ActiveSpCoursesListState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(ActiveSpCoursesListState.selfPacedCourses)
  selfPacedCourses$: Observable<ActiveSelfPacedCourse[]>;

  @Select(ActiveSpCoursesListState.pageSize)
  pageSize$: Observable<number>;

  @Select(ActiveSpCoursesListState.total)
  total$: Observable<number>;

  @Select(ActiveSpCoursesListState.pageIndex)
  pageIndex$: Observable<number>;

  trackByFn: TrackByFunction<ActiveSelfPacedCourse> = (index, item) => item.id;

  constructor(
    private readonly store: Store,
    private readonly createSpCourseLanguageVariantHandler: CreateSpCourseVariantHandlerService,
    public readonly environmentService: EnvironmentService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new ResetActiveSPCoursesState());
  }

  createLanguageVariant(event: MouseEvent, course: ActiveSelfPacedCourse): void {
    event.stopPropagation();
    this.createSpCourseLanguageVariantHandler.createSpCourseLanguageVariant(course);
  }

  onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeActiveSPCoursesPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetActiveSelfPacedCourses(),
    ]);
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([new ChangeActiveSPCoursesPaginationParams({ pageable }), new GetActiveSelfPacedCourses()]);
  }
}
