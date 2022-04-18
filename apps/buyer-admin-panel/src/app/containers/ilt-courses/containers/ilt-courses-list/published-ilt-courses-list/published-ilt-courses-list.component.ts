import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { NzTableQueryParams } from "ng-zorro-antd/table";

import { PublishedILTCoursesState } from "./state/published-ilt-courses.state";
import {
  ChangePublishedILTCoursesPaginationParams,
  GetPublishedILTCourses,
  ResetPublishedILTCoursesState
} from "./state/published-ilt-courses.actions";
import {
  ScheduleCourseEventHandlerService
} from "../../../service/schedule-course-event-handler.service";

import { PublishedILTCourse } from "../../../../../../../../../libs/shared/src/lib/models";
import { createPageableFromTableQueryParams } from "../../../../../../../../../libs/shared/src/lib/utils/common";
import { EnvironmentService } from "../../../../../../../../../libs/shared/src/lib/services/common/environment.service";

@Component({
  selector: 'leap-published-ilt-courses-list',
  templateUrl: './published-ilt-courses-list.component.html',
  styleUrls: ['./published-ilt-courses-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishedIltCoursesListComponent implements OnInit {
  @Select(PublishedILTCoursesState.loading)
  loading$: Observable<boolean>;

  @Select(PublishedILTCoursesState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(PublishedILTCoursesState.iltCourses)
  iltCourses$: Observable<PublishedILTCourse[]>;

  @Select(PublishedILTCoursesState.pageSize)
  pageSize$: Observable<number>;

  @Select(PublishedILTCoursesState.total)
  total$: Observable<number>;

  @Select(PublishedILTCoursesState.pageIndex)
  pageIndex$: Observable<number>;

  trackByFn: TrackByFunction<PublishedILTCourse> = (index, item) => item.id;

  constructor(
    private readonly store: Store,
    private readonly scheduleCourseEventHandlerService: ScheduleCourseEventHandlerService,
    public readonly environmentService: EnvironmentService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new ResetPublishedILTCoursesState());
  }

  onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangePublishedILTCoursesPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetPublishedILTCourses(),
    ]);
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([new ChangePublishedILTCoursesPaginationParams({ pageable }), new GetPublishedILTCourses()]);
  }

  scheduleEvent(event: MouseEvent, course: PublishedILTCourse): void {
    event.stopPropagation();
    this.scheduleCourseEventHandlerService.scheduleCourseEvent(course);
  }
}
