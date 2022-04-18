import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  TrackByFunction,
  ChangeDetectorRef,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, withLatestFrom } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzTableQueryParams } from 'ng-zorro-antd/table/ng-zorro-antd-table';

import { SpCourseVariantExamsState } from './sp-course-variant-exams/sp-course-variant-exams.state';
import {
  ChangeSPCourseLanguageVariantExamSKU,
  ChangeSPCourseLanguageVariantExamsPage,
  GetSPCourseLanguageVariantExams,
} from './sp-course-variant-exams/sp-course-variant-exams.actions';

import { SPCourseLanguageVariant } from '../../../../../../../../../../../../../libs/shared/src/lib/models/courses/sp-courses/sp-course.model';
import { SPCourseLanguageVariantExam } from '../../../../../../../../../../../../../libs/shared/src/lib/models/courses/sp-courses/sp-course-language-variant-exam.model';
import {
  IKeyValuePair,
  InternalRepositoryMaterial, IPageable
} from "../../../../../../../../../../../../../libs/shared/src/lib/models";
import {
  createPageableFromTableQueryParams,
  DeferredResource
} from "../../../../../../../../../../../../../libs/shared/src/lib/utils/common";

@Component({
  selector: 'leap-sp-course-variant-exams',
  templateUrl: './sp-course-variant-exams.component.html',
  styleUrls: ['./sp-course-variant-exams.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class SpCourseVariantExamsComponent implements OnInit, OnChanges, OnDestroy {
  private readonly paginationParamsChangeSubject: Subject<IPageable> = new Subject<IPageable>();

  examTrackingFilterOptionsSubject = new BehaviorSubject<IKeyValuePair[]>([]);

  get examTrackingFilterOptions$(): Observable<IKeyValuePair[]> {
    return this.examTrackingFilterOptionsSubject.asObservable();
  }

  form: FormGroup;

  @Select(SpCourseVariantExamsState.exams)
  exams$: Observable<DeferredResource<{ data: SPCourseLanguageVariantExam[]; flags: { size: number } }>>;

  @Select(SpCourseVariantExamsState.paginationParams)
  paginationParams$: Observable<IPageable>;

  @Input() spCourseLanguageVariant: SPCourseLanguageVariant;
  @Input() examMaterials: InternalRepositoryMaterial[] = [];

  total = 0;
  data: SPCourseLanguageVariantExam[] = [];
  loading: boolean;

  examOptionCompareFn = (o1: IKeyValuePair, o2: IKeyValuePair) => {
    return o1 && o2 ? o1.key === o2.key : o1 === o2;
  };

  tableRowTrackByFn: TrackByFunction<SPCourseLanguageVariantExam> = (index, item) => item.id;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      selectedExam: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.form
      .get('selectedExam')
      .valueChanges.pipe(
        filter((exam: IKeyValuePair) => !!exam),
        map((exam: IKeyValuePair) => exam.key),
        distinctUntilChanged(),
        untilDestroyed(this),
      )
      .subscribe((examVariantSKU: string) => {
        this.selectExam(examVariantSKU);
      });

    this.paginationParamsChangeSubject
      .asObservable()
      .pipe(
        withLatestFrom(this.paginationParams$),
        filter(([change, current]) => {
          return change.page !== current.page;
        }),
        untilDestroyed(this),
      )
      .subscribe(([change]) => {
        this.store.dispatch([
          new ChangeSPCourseLanguageVariantExamsPage({ page: change.page }),
          new GetSPCourseLanguageVariantExams({ id: this.spCourseLanguageVariant.id }),
        ]);
      });

    this.exams$.pipe(untilDestroyed(this)).subscribe((resource) => {
      if (resource) {
        this.loading = resource.isPending;

        if (resource.isSuccess && resource.response) {
          this.data = resource.response.data;
          this.total = resource.response.flags.size;
        }

        this.cdr.markForCheck();
      }
    });

    this.initExamsTrackingList(this.examMaterials);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.examMaterials && changes.examMaterials.currentValue) {
      const exams = changes.examMaterials.currentValue;

      if (exams && Array.isArray(exams)) {
        this.initExamsTrackingList(exams);
      }
    }
  }

  ngOnDestroy(): void {
    this.paginationParamsChangeSubject.complete();
    this.examTrackingFilterOptionsSubject.complete();
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    this.paginationParamsChangeSubject.next(createPageableFromTableQueryParams(queryParams));
  }

  downloadReport(exam: SPCourseLanguageVariantExam): void {
    const reportPath = exam.pdfReport;

    if (reportPath) {
      window.open(reportPath, '_blank', 'noopener,noreferrer');
    } else {
      this.router.navigate(['/not-found']);
    }
  }

  private initExamsTrackingList(exams: InternalRepositoryMaterial[]) {
    const mappedExams = mapMaterials(exams);

    this.examTrackingFilterOptionsSubject.next(mappedExams);

    if (mappedExams.length) {
      this.form.patchValue(
        {
          selectedExam: mappedExams[0],
        },
        { emitEvent: true },
      );
    }
  }

  private selectExam(examVariantSKU: string): void {
    this.store.dispatch([
      new ChangeSPCourseLanguageVariantExamSKU({ examVariantSKU }),
      new ChangeSPCourseLanguageVariantExamsPage({ page: 1 }),
      new GetSPCourseLanguageVariantExams({ id: this.spCourseLanguageVariant.id }),
    ]);
  }
}

function mapMaterials(materials: InternalRepositoryMaterial[]): IKeyValuePair[] {
  return materials.map((mir) => {
    return {
      value: mir.defaultVariant.name,
      key: mir.defaultVariantSKU,
    };
  });
}
