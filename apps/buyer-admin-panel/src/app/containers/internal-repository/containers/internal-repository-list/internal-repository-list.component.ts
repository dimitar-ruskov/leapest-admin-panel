import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import * as moment from 'moment';

import {
  ChangeInternalRepositoriesPaginationParams,
  DeleteInternalRepository,
  GetInternalRepositories,
  ResetInternalRepositoriesState,
} from './state/internal-repository-list.actions';
import { InternalRepositoryListState } from './state/internal-repository-list.state';
import { InternalRepositoryCreateModalComponent } from '../internal-repository-create-modal/internal-repository-create-modal.component';

import {InternalRepository} from "../../../../../../../../libs/shared/src/lib/models/interfaces";
import {createPageableFromTableQueryParams} from "../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DangerActionModalComponent
} from "../../../../../../../../libs/shared/src/lib/components/modals/danger-action-modal/danger-action-modal.component";

@Component({
  selector: 'leap-internal-repository-list',
  templateUrl: './internal-repository-list.component.html',
  styleUrls: ['./internal-repository-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalRepositoryListComponent implements OnInit {
  @Select(InternalRepositoryListState.loading)
  loading$: Observable<boolean>;

  @Select(InternalRepositoryListState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(InternalRepositoryListState.internalRepositories)
  internalRepositories$: Observable<InternalRepository[]>;

  @Select(InternalRepositoryListState.pageSize)
  pageSize$: Observable<number>;

  @Select(InternalRepositoryListState.total)
  total$: Observable<number>;

  @Select(InternalRepositoryListState.pageIndex)
  pageIndex$: Observable<number>;

  trackByFn: TrackByFunction<InternalRepository> = (index, item) => item.sku;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly modalService: NzModalService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch([new ResetInternalRepositoriesState()]);
  }

  public onSearchChange(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeInternalRepositoriesPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetInternalRepositories(),
    ]);
  }

  public onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([new ChangeInternalRepositoriesPaginationParams({ pageable }), new GetInternalRepositories()]);
  }

  public deleteInternalRepository(e: MouseEvent, ir: InternalRepository): void {
    e.stopPropagation();
    if (ir.deletable) {
      const modal: NzModalRef = this.modalService.create({
        nzTitle: 'Delete Internal Repository?',
        nzContent: DangerActionModalComponent,
        nzComponentParams: {
          mainExp: `You are about to delete the ${ir.name}. This action cannot be undone. How do you wish to proceed?`,
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
            label: 'Delete',
            danger: true,
            onClick: async () => {
              return this.store
                .dispatch(new DeleteInternalRepository({ sku: ir.sku }))
                .toPromise()
                .then(() => {
                  modal.destroy();
                  this.store.dispatch([
                    new ChangeInternalRepositoriesPaginationParams({ pageable: { page: 1 } }),
                    new GetInternalRepositories(),
                  ]);
                });
            },
          },
        ],
      });
    }
  }

  public onCreateIR(): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'What would you like to create?',
      nzContent: InternalRepositoryCreateModalComponent,
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: null,
    });
    const instance = modal.getContentComponent();
    const modalDestroyed$ = modal.afterClose.asObservable().pipe(take(1));
    instance.closeModal.pipe(takeUntil(modalDestroyed$)).subscribe(() => {
      modal.close();
    });
  }

  public formatDate(dt: string): string {
    if (!dt) {
      return 'N/A';
    } else {
      return moment(dt).format('D MMM YYYY');
    }
  }
}
