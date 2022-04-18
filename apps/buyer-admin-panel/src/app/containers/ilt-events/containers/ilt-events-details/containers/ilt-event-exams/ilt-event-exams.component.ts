import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TrackByFunction
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Select, Store } from "@ngxs/store";
import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged, filter, map } from "rxjs/operators";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzTableQueryParams } from "ng-zorro-antd/table";

import {
  ChangeILTEventExamsFilterSKU,
  ChangeILTEventExamsPaginationParams,
  GetILTEventExams,
  ResetILTEventExamsState
} from "./state/ilt-event-exams.actions";
import { IltEventExamsState } from "./state/ilt-event-exams.state";

import {
  ExamCompletionReport,
  IKeyValuePair,
  ILTEvent,
  InternalRepositoryMaterial
} from "../../../../../../../../../../libs/shared/src/lib/models";
import { createPageableFromTableQueryParams } from "../../../../../../../../../../libs/shared/src/lib/utils/common";

@Component({
  selector: 'leap-ilt-event-exams',
  templateUrl: './ilt-event-exams.component.html',
  styleUrls: ['./ilt-event-exams.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltEventExamsComponent implements OnInit, OnDestroy {
  skipQueryParamsChange = true;

  examsFilterOptionsSubject = new BehaviorSubject<IKeyValuePair[]>([]);

  get examsFilterOptions$(): Observable<IKeyValuePair[]> {
    return this.examsFilterOptionsSubject.asObservable();
  }

  form: FormGroup;

  @Select(IltEventExamsState.loading)
  loading$: Observable<boolean>;

  @Select(IltEventExamsState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(IltEventExamsState.iltEventExams)
  iltEventExams$: Observable<ExamCompletionReport[]>;

  @Select(IltEventExamsState.pageSize)
  pageSize$: Observable<number>;

  @Select(IltEventExamsState.total)
  total$: Observable<number>;

  @Select(IltEventExamsState.pageIndex)
  pageIndex$: Observable<number>;

  @Input() iltEvent: ILTEvent;
  @Input() examMaterials: InternalRepositoryMaterial[];

  examOptionCompareFn = (o1: IKeyValuePair, o2: IKeyValuePair) => {
    return o1 && o2 ? o1.key === o2.key : o1 === o2;
  };

  tableRowTrackByFn: TrackByFunction<ExamCompletionReport> = (index, item) => index;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly modalService: NzModalService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
  ) {
    this.form = this.fb.group({
      selectedExam: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new ResetILTEventExamsState());
    this.form
      .get('selectedExam')
      .valueChanges.pipe(
        filter((material) => !!material),
        map((material) => material.key),
        distinctUntilChanged(),
        untilDestroyed(this),
      )
      .subscribe((materialSKU) => {
        this.store.dispatch([
          new ChangeILTEventExamsPaginationParams({ pageable: { page: 1 } }),
          new ChangeILTEventExamsFilterSKU({ materialSKU }),
          new GetILTEventExams({ eventId: this.iltEvent.id }),
        ]);
      });

    this.initExams(this.examMaterials);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.examMaterials && changes.examMaterials.currentValue) {
      const examMaterials = changes.examMaterials.currentValue;

      if (examMaterials && Array.isArray(examMaterials)) {
        this.initExams(examMaterials);
      }
    }
  }

  ngOnDestroy(): void {
    this.examsFilterOptionsSubject.complete();
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    if (this.skipQueryParamsChange) {
      this.skipQueryParamsChange = false;
    } else {
      const pageable = createPageableFromTableQueryParams(queryParams);

      this.store.dispatch([
        new ChangeILTEventExamsPaginationParams({ pageable }),
        new GetILTEventExams({ eventId: this.iltEvent.id }),
      ]);
    }
  }

  private initExams(materials: InternalRepositoryMaterial[]): void {
    const mappedMaterials = mapMaterials(materials);

    this.examsFilterOptionsSubject.next(mappedMaterials);

    if (materials.length) {
      this.form.patchValue(
        {
          selectedExam: mappedMaterials[0],
        },
        { emitEvent: true },
      );
    }
  }

  downloadExamReport(reportPath: string) {
    if (reportPath) {
      window.open(reportPath, '_blank', 'noopener,noreferrer');
    } else {
      this.router.navigate(['/not-found']);
    }
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
