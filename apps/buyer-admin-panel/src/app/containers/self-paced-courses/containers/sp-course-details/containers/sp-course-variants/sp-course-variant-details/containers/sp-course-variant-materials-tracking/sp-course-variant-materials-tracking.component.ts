import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TrackByFunction
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, withLatestFrom } from "rxjs/operators";
import { Select, Store } from "@ngxs/store";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzTableQueryParams } from "ng-zorro-antd/table";

import {
  IKeyValuePair,
  InternalRepositoryMaterial,
  IPageable,
  MaterialCompletionReport,
  SPCourseLanguageVariant
} from "../../../../../../../../../../../../../libs/shared/src/lib/models";
import {
  createPageableFromTableQueryParams,
  DeferredResource
} from "../../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  MaterialsTrackingDetailsModalComponent
} from "../../../../../../../../../../../../../libs/shared/src/lib/components/modals/materials-tracking-details-modal/materials-tracking-details-modal.component";
import {
  ChangeSPCourseLanguageVariantMaterialSKU,
  ChangeSPCourseLanguageVariantMaterialsTrackingPage,
  GetSPCourseLanguageVariantMaterialsTrackingList
} from "./state/sp-course-variant-materials-tracking.actions";
import { SpCourseVariantMaterialsTrackingState } from "./state/sp-course-variant-materials-tracking.state";


@Component({
  selector: 'leap-sp-course-variant-materials-tracking',
  templateUrl: './sp-course-variant-materials-tracking.component.html',
  styleUrls: ['./sp-course-variant-materials-tracking.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class SpCourseVariantMaterialsTrackingComponent implements OnInit, OnChanges, OnDestroy {
  private readonly paginationParamsChangeSubject: Subject<IPageable> = new Subject<IPageable>();

  materialTrackingFilterOptionsSubject = new BehaviorSubject<IKeyValuePair[]>([]);

  get materialTrackingFilterOptions$(): Observable<IKeyValuePair[]> {
    return this.materialTrackingFilterOptionsSubject.asObservable();
  }

  form: FormGroup;

  @Select(SpCourseVariantMaterialsTrackingState.materialsTrackingList)
  materialsTrackingList$: Observable<DeferredResource<{ data: MaterialCompletionReport[]; flags: { size: number } }>>;

  @Select(SpCourseVariantMaterialsTrackingState.paginationParams)
  paginationParams$: Observable<IPageable>;

  @Input() spCourseLanguageVariant: SPCourseLanguageVariant;
  @Input() materials: InternalRepositoryMaterial[];

  total = 0;
  data: MaterialCompletionReport[] = [];
  loading: boolean;

  materialOptionCompareFn = (o1: IKeyValuePair, o2: IKeyValuePair) => {
    return o1 && o2 ? o1.key === o2.key : o1 === o2;
  };

  tableRowTrackByFn: TrackByFunction<MaterialCompletionReport> = (index, item) => index;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly modalService: NzModalService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      selectedMaterial: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.form
      .get('selectedMaterial')
      .valueChanges.pipe(
        filter((material) => !!material),
        map((material) => material.key),
        distinctUntilChanged(),
        untilDestroyed(this),
      )
      .subscribe((materialSKU) => {
        this.store.dispatch([
          new ChangeSPCourseLanguageVariantMaterialsTrackingPage({ page: 1 }),
          new ChangeSPCourseLanguageVariantMaterialSKU({ materialSKU }),
          new GetSPCourseLanguageVariantMaterialsTrackingList({ id: this.spCourseLanguageVariant.id }),
        ]);
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
          new ChangeSPCourseLanguageVariantMaterialsTrackingPage({ page: 1 }),
          new GetSPCourseLanguageVariantMaterialsTrackingList({ id: this.spCourseLanguageVariant.id }),
        ]);
      });

    this.materialsTrackingList$.pipe(untilDestroyed(this)).subscribe((resource) => {
      if (resource) {
        this.loading = resource.isPending;

        if (resource.isSuccess && resource.response) {
          this.data = resource.response.data;
          this.total = resource.response.flags.size;
        }

        this.cdr.markForCheck();
      }
    });

    this.initMaterialsTrackingList(this.materials);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.materials && changes.materials.currentValue) {
      const materials = changes.materials.currentValue;

      if (materials && Array.isArray(materials)) {
        this.initMaterialsTrackingList(materials);
      }
    }
  }

  ngOnDestroy(): void {
    this.materialTrackingFilterOptionsSubject.complete();
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    this.paginationParamsChangeSubject.next(createPageableFromTableQueryParams(queryParams));
  }

  private initMaterialsTrackingList(materials: InternalRepositoryMaterial[]): void {
    const mappedMaterials = mapMaterials(materials);

    this.materialTrackingFilterOptionsSubject.next(mappedMaterials);

    if (materials.length) {
      this.form.patchValue(
        {
          selectedMaterial: mappedMaterials[0],
        },
        { emitEvent: true },
      );
    }
  }

  seeDetails(report: MaterialCompletionReport): void {
    const selectedMaterial = this.form.get('selectedMaterial').value;

    const modal = this.modalService.create({
      nzTitle: 'Completion Details',
      nzContent: MaterialsTrackingDetailsModalComponent,
      nzComponentParams: {
        data: { ...report, materialName: selectedMaterial.value },
      },
      nzWidth: '80%',
      nzFooter: [
        {
          label: 'Close',
          type: 'default',
          onClick: () => modal.destroy(),
        },
      ],
    });
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
