import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ResetInternalRepositoryCoursesState } from './containers/internal-repository-details-courses/state/internal-repository-courses.actions';
import { GetInternalRepositoryDetails } from './state/internal-repository-details.actions';
import { InternalRepositoryDetailsState } from './state/internal-repository-details.state';
import {
  GetInternalRepositoryVariants,
  ResetInternalRepositoryVariantsState
} from './containers/internal-repository-details-variants/state/internal-repository-variants.actions';
import { InternalRepoHostedModalComponent } from '../../../../../../../../libs/shared/src/lib/components/feature/internal-repo/internal-repository-create-modal/steps/internal-repo-hosted-modal/internal-repo-hosted-modal.component';
import { InternalRepoExternalModalComponent } from '../../../../../../../../libs/shared/src/lib/components/feature/internal-repo/internal-repository-create-modal/steps/internal-repo-external-modal/internal-repo-external-modal.component';

import {DeferredResource} from "../../../../../../../../libs/shared/src/lib/utils/common";
import {InternalRepository} from "../../../../../../../../libs/shared/src/lib/models";

@Component({
  selector: 'leap-internal-repository-details',
  templateUrl: './internal-repository-details.component.html',
  styleUrls: ['./internal-repository-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalRepositoryDetailsComponent implements OnInit {
  @Select(InternalRepositoryDetailsState.internalRepository)
  internalRepository$: Observable<DeferredResource<InternalRepository>>;

  private sku: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly modalService: NzModalService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(take(1)).subscribe((paramMap: ParamMap) => {
      this.sku = paramMap.get('sku');
      this.store.dispatch([
        new GetInternalRepositoryDetails(paramMap.get('sku')),
        new ResetInternalRepositoryVariantsState(),
        new ResetInternalRepositoryCoursesState(),
      ]);
    });

    // @TODO need to be added after navigation from loader modal
    // this.store.dispatch([
    //   new GetInternalRepositoryVariants({ sku: this.internalRepo.parentSKU }),
    //   new GetInternalRepositoryDetails(this.internalRepo.parentSKU),
    // ]);
  }

  public onCreateNewVariant(resource: InternalRepository): void {
    resource.path ? this.openExternal(resource) : this.openHosted(resource);
  }

  private openExternal(resource): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'What would you like to create?',
      nzContent: InternalRepoExternalModalComponent,
      nzComponentParams: {
        type: { key: resource.type.configKey, value: resource.type.configValue },
        parentSKU: this.sku,
        isVariant: true,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: null,
    });
    this.handleModalOnClose(modal);
  }

  private openHosted(resource): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'What would you like to create?',
      nzContent: InternalRepoHostedModalComponent,
      nzComponentParams: {
        type: { key: resource.type.configKey, value: resource.type.configValue },
        parentSKU: this.sku,
        isVariant: true,
      },
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
}
