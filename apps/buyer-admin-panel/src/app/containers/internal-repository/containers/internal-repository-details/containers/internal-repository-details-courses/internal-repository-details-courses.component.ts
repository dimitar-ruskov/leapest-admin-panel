import {ChangeDetectionStrategy, Component, TrackByFunction} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {NzTableQueryParams} from 'ng-zorro-antd/table';

import {
  InternalRepositoryCourseListItem
} from '../../../../../../../../../../libs/shared/src/lib/models/interfaces/internal-repo/internal-repository-course-list-item.model';
import {
  ChangeInternalRepositoryCoursesPaginationParams,
  GetInternalRepositoryCourses
} from '../../../../state/internal-repository-details/internal-repository-courses.actions';
import {
  InternalRepositoryCoursesState
} from '../../../../state/internal-repository-details/internal-repository-courses.state';
import {createPageableFromTableQueryParams} from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {TGridInputModel} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";

@Component({
  selector: 'leap-internal-repository-details-courses',
  templateUrl: './internal-repository-details-courses.component.html',
  styleUrls: ['./internal-repository-details-courses.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InternalRepositoryDetailsCoursesComponent {
  sku: string
  config: TGridInputModel;

  @Select(InternalRepositoryCoursesState.loading)
  loading$: Observable<boolean>;

  @Select(InternalRepositoryCoursesState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(InternalRepositoryCoursesState.internalRepositoryCourses)
  courses$: Observable<InternalRepositoryCourseListItem[]>;

  @Select(InternalRepositoryCoursesState.pageSize)
  pageSize$: Observable<number>;

  @Select(InternalRepositoryCoursesState.total)
  total$: Observable<number>;

  @Select(InternalRepositoryCoursesState.pageIndex)
  pageIndex$: Observable<number>;

  trackByFn: TrackByFunction<InternalRepositoryCourseListItem> = (index, item) => item.id;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store) {
    this.route.paramMap.pipe(
      take(1),
      map((paramMap: ParamMap) => paramMap.get('sku'))
    ).subscribe((sku: string) => {
      this.sku = sku;
    });
  }

  onSearchChange(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeInternalRepositoryCoursesPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetInternalRepositoryCourses({ sku: this.sku })
    ]);
  }


  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);
    this.store.dispatch([
      new ChangeInternalRepositoryCoursesPaginationParams({ pageable }),
      new GetInternalRepositoryCourses({ sku: this.sku })
    ]);
  }
  goToCourse(id: string) {
    this.router.navigate(['admin', 'ilt-courses', 'details', id])
  }

}
