import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  TrackByFunction,
  ChangeDetectorRef,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import {
  ChangeILTEventMaterialTrackingFilterSKU,
  ChangeILTEventMaterialTrackingListPaginationParams,
  GetILTEventMaterialTrackingList,
  ResetILTEventMaterialTrackingListState,
} from './state/ilt-event-materials-tracking.actions';
import { IltEventMaterialsTrackingState } from './state/ilt-event-materials-tracking.state';

import {
  IKeyValuePair,
  ILTEvent,
  InternalRepositoryMaterial, MaterialCompletionReport
} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {createPageableFromTableQueryParams} from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  MaterialsTrackingDetailsModalComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/modals/materials-tracking-details-modal/materials-tracking-details-modal.component";

@Component({
  selector: 'leap-ilt-event-materials-tracking',
  templateUrl: './ilt-event-materials-tracking.component.html',
  styleUrls: ['./ilt-event-materials-tracking.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltEventMaterialsTrackingComponent implements OnInit, OnDestroy {
  skipQueryParamsChange = true;

  materialTrackingFilterOptionsSubject = new BehaviorSubject<IKeyValuePair[]>([]);

  get materialTrackingFilterOptions$(): Observable<IKeyValuePair[]> {
    return this.materialTrackingFilterOptionsSubject.asObservable();
  }

  form: FormGroup;

  @Select(IltEventMaterialsTrackingState.loading)
  loading$: Observable<boolean>;

  @Select(IltEventMaterialsTrackingState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(IltEventMaterialsTrackingState.iltEventMaterialTrackingList)
  materialsTrackingList$: Observable<MaterialCompletionReport[]>;

  @Select(IltEventMaterialsTrackingState.pageSize)
  pageSize$: Observable<number>;

  @Select(IltEventMaterialsTrackingState.total)
  total$: Observable<number>;

  @Select(IltEventMaterialsTrackingState.pageIndex)
  pageIndex$: Observable<number>;

  @Input() iltEvent: ILTEvent;
  @Input() materials: InternalRepositoryMaterial[];

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
    this.store.dispatch(new ResetILTEventMaterialTrackingListState());
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
          new ChangeILTEventMaterialTrackingListPaginationParams({ pageable: { page: 1 } }),
          new ChangeILTEventMaterialTrackingFilterSKU({ materialSKU }),
          new GetILTEventMaterialTrackingList({ eventId: this.iltEvent.id }),
        ]);
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
    if (this.skipQueryParamsChange) {
      this.skipQueryParamsChange = false;
    } else {
      const pageable = createPageableFromTableQueryParams(queryParams);

      this.store.dispatch([
        new ChangeILTEventMaterialTrackingListPaginationParams({ pageable }),
        new GetILTEventMaterialTrackingList({ eventId: this.iltEvent.id }),
      ]);
    }
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
