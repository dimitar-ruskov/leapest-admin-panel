import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table/ng-zorro-antd-table';

import { SpCourseVariantsState } from './state/sp-course-variants.state';
import {
  ChangeSPCourseLanguageVariantsPaginationParams,
  GetSPCourseLanguageVariants,
  ResetSPCourseLanguageVariantsState,
} from './state/sp-course-variants.actions';

import { SPCourseLanguageVariant } from '../../../../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course.model';
import {createPageableFromTableQueryParams} from "../../../../../../../../../../libs/shared/src/lib/utils/common";

@Component({
  selector: 'leap-sp-course-variants',
  templateUrl: './sp-course-variants.component.html',
  styleUrls: ['./sp-course-variants.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpCourseVariantsComponent implements OnInit {
  courseId: string;
  @Select(SpCourseVariantsState.loading)
  loading$: Observable<boolean>;

  @Select(SpCourseVariantsState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(SpCourseVariantsState.spCourseLanguageVariants)
  spCourseLanguageVariants$: Observable<SPCourseLanguageVariant[]>;

  @Select(SpCourseVariantsState.pageSize)
  pageSize$: Observable<number>;

  @Select(SpCourseVariantsState.total)
  total$: Observable<number>;

  @Select(SpCourseVariantsState.pageIndex)
  pageIndex$: Observable<number>;

  trackByFn: TrackByFunction<SPCourseLanguageVariant> = (index, item) => item.id;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new ResetSPCourseLanguageVariantsState());
    this.route.paramMap
      .pipe(
        take(1),
        map((paramMap: ParamMap) => paramMap.get('id')),
      )
      .subscribe((id: string) => {
        this.courseId = id;
      });
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);
    this.store.dispatch([
      new ChangeSPCourseLanguageVariantsPaginationParams({ pageable }),
      new GetSPCourseLanguageVariants({ id: this.courseId }),
    ]);
  }

  onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeSPCourseLanguageVariantsPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetSPCourseLanguageVariants({ id: this.courseId }),
    ]);
  }
}
