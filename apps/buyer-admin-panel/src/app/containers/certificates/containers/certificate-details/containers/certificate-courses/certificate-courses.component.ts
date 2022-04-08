import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table/ng-zorro-antd-table';

import { CertificateCoursesState } from '../../../../state/certificates-details/certificate-courses.state';
import {
  ChangeCertCoursesPaginationParams,
  GetCertificateCourses,
  ResetCertificateCoursesState,
} from '../../../../state/certificates-details/certificate-courses.actions';

import {
  createPageableFromTableQueryParams,
  DeferredResource
} from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {DraftILTCourse, IPageable} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";

const NO_COURSES_TEXT = 'No matching courses!';

@Component({
  selector: 'leap-certificate-courses',
  templateUrl: './certificate-courses.component.html',
  styleUrls: ['./certificate-courses.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateCoursesComponent implements OnInit {
  noResultsText = NO_COURSES_TEXT;

  @Select(CertificateCoursesState.courses)
  courses$: Observable<DeferredResource<DraftILTCourse[]>>;

  @Select(CertificateCoursesState.loading)
  loading$: Observable<boolean>;

  @Select(CertificateCoursesState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(CertificateCoursesState.pageSize)
  pageSize$: Observable<number>;

  @Select(CertificateCoursesState.total)
  total$: Observable<number>;

  @Select(CertificateCoursesState.pageIndex)
  pageIndex$: Observable<number>;

  public certificateId: string;

  trackByFn: TrackByFunction<DraftILTCourse> = (index, item) => item.id;

  constructor(private readonly store: Store, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.certificateId = this.route.snapshot.paramMap.get('id');
    this.store.dispatch([new ResetCertificateCoursesState()]);
  }

  public onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable: IPageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([
      new ChangeCertCoursesPaginationParams({ pageable }),
      new GetCertificateCourses({ certificateId: this.certificateId }),
    ]);
  }

  public onSearchChange(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeCertCoursesPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetCertificateCourses({ certificateId: this.certificateId }),
    ]);
  }
}
