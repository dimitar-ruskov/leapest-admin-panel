import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import * as moment from 'moment';

import {
  ChangeInternalRepositoryVariantsPaginationParams,
  DeleteInternalRepositoryVariant,
  GetInternalRepositoryVariants,
} from '../../state/internal-repository-variants.actions';
import { InternalRepositoryVariantsState } from '../../state/internal-repository-variants.state';
import { InternalRepoExternalModalComponent } from '../../../internal-repository-create-modal/steps/internal-repo-external-modal/internal-repo-external-modal.component';
import { InternalRepoHostedModalComponent } from '../../../internal-repository-create-modal/steps/internal-repo-hosted-modal/internal-repo-hosted-modal.component';

import { InternalRepositoryVariantDTO } from '../../../../../../../../../../libs/shared/src/lib/models/interfaces/internal-repo/internal-repository-variant-dto.model';
import {
  DangerActionModalComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/modals/danger-action-modal/danger-action-modal.component";
import {createPageableFromTableQueryParams} from "../../../../../../../../../../libs/shared/src/lib/utils/common";

@Component({
  selector: 'leap-internal-repository-details-variants',
  templateUrl: './internal-repository-details-variants.component.html',
  styleUrls: ['./internal-repository-details-variants.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalRepositoryDetailsVariantsComponent implements OnInit {
  private sku: string;

  @Select(InternalRepositoryVariantsState.loading)
  loading$: Observable<boolean>;

  @Select(InternalRepositoryVariantsState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(InternalRepositoryVariantsState.internalRepositoryVariants)
  variants$: Observable<InternalRepositoryVariantDTO[]>;

  @Select(InternalRepositoryVariantsState.pageSize)
  pageSize$: Observable<number>;

  @Select(InternalRepositoryVariantsState.total)
  total$: Observable<number>;

  @Select(InternalRepositoryVariantsState.pageIndex)
  pageIndex$: Observable<number>;

  trackByFn: TrackByFunction<InternalRepositoryVariantDTO> = (index, item) => item.sku;

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly modalService: NzModalService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        take(1),
        map((paramMap: ParamMap) => paramMap.get('sku')),
      )
      .subscribe((sku: string) => {
        this.sku = sku;
      });
  }

  public onSearchChange(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeInternalRepositoryVariantsPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetInternalRepositoryVariants({ sku: this.sku }),
    ]);
  }

  public deleteVariant(e: MouseEvent, variant: InternalRepositoryVariantDTO): void {
    e.stopPropagation();
    if (variant.deletable) {
      const modal: NzModalRef = this.modalService.create({
        nzTitle: 'Delete Variant?',
        nzContent: DangerActionModalComponent,
        nzComponentParams: {
          mainExp: `You are about to delete the ${variant.name}. This action cannot be undone. How do you wish to proceed?`,
        },
        nzWrapClassName: 'modal-class',
        nzWidth: 660,
        nzFooter: [
          {
            label: 'Cancel',
            type: 'text',
            onClick: () => modal.destroy(),
          },
          {
            label: 'Delete Variant',
            danger: true,
            onClick: async () => {
              return this.store
                .dispatch(new DeleteInternalRepositoryVariant({ sku: variant.sku }))
                .toPromise()
                .then(() => {
                  modal.destroy();
                  this.store.dispatch([
                    new ChangeInternalRepositoryVariantsPaginationParams({ pageable: { page: 1 } }),
                    new GetInternalRepositoryVariants({ sku: this.sku }),
                  ]);
                });
            },
          },
        ],
      });
    }
  }

  public editVariant(e: MouseEvent, variant: InternalRepositoryVariantDTO): void {
    e.stopPropagation();
    let nzComponentParams;
    const isExternal = variant.contents[0]?.contentType.configKey === 'ext-content-link';
    if (!isExternal) {
      nzComponentParams = {
        contentsArray:
          variant.type.configKey === 'exam'
            ? []
            : variant.contents.map((c) => ({
                key: c.key,
                bucket: c.bucket,
                name: c.displayName,
                order: c.order,
              })),
        examReferenceId:
          variant.type.configKey === 'exam' && variant.contents.length > 0 ? variant.contents[0].contentId : null,
        initExam: variant.type.configKey === 'exam' && variant.contents.length > 0 ? variant.contents[0] : null,
      };
    } else {
      nzComponentParams = {
        path: variant.contents.length > 0 ? variant.contents[0].externalID : null,
        itemId: variant.contents[0].id,
      };
    }
    nzComponentParams.type = { key: variant.type.configKey, value: variant.type.configValue };
    nzComponentParams.name = variant.name;
    nzComponentParams.language = variant.language.configValue;
    nzComponentParams.parentSKU = this.sku;
    nzComponentParams.sku = variant.sku;
    nzComponentParams.deliverableId = variant.deliverableId;
    nzComponentParams.isVariant = true;

    if (variant.deletable) {
      variant.contents[0]?.contentType.configKey === 'ext-content-link'
        ? this.openExternal(nzComponentParams)
        : this.openHosted(nzComponentParams);
    }
  }

  private openExternal(nzComponentParams): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'What would you like to create?',
      nzContent: InternalRepoExternalModalComponent,
      nzComponentParams,
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: null,
    });
    this.handleModalOnClose(modal);
  }

  private openHosted(nzComponentParams): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'What would you like to create?',
      nzContent: InternalRepoHostedModalComponent,
      nzComponentParams,
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: null,
    });
    this.handleModalOnClose(modal);
  }

  private handleModalOnClose(modal: NzModalRef): void {
    const instance = modal.getContentComponent();
    const modalDestroyed$ = modal.afterClose.asObservable().pipe(take(1));
    instance.onClose.pipe(takeUntil(modalDestroyed$)).subscribe(() => {
      modal.close();
    });
  }

  public onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);
    this.store.dispatch([
      new ChangeInternalRepositoryVariantsPaginationParams({ pageable }),
      new GetInternalRepositoryVariants({ sku: this.sku }),
    ]);
  }

  public formatDate(dt: string): string {
    if (!dt) {
      return 'N/A';
    } else {
      return moment(dt).format('D MMM YYYY');
    }
  }

  public deleteVariantTooltip(variant: InternalRepositoryVariantDTO, total: number): string {
    if (total === 1) {
      return 'You can not delete the only variant';
    } else if (variant.deletable) {
      return 'Delete Variant';
    } else {
      return (
        'This variant is already being used in ' +
        variant.occurrenceCounter.toString() +
        ' courses. To delete it, please remove it first from each course'
      );
    }
  }
}
