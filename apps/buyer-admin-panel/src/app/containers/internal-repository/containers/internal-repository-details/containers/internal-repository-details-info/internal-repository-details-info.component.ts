import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Select } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { InternalRepositoryEditInfoHandlerService } from '../../../../service/internal-repository-edit-info-handler.service';
import { InternalRepositoryDetailsState } from '../../../../state/internal-repository-details/internal-repository-details.state';

import {DeferredResource} from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  GeneralInfoField,
  InternalRepository
} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";

@Component({
  selector: 'leap-internal-repository-details-info',
  templateUrl: './internal-repository-details-info.component.html',
  styleUrls: ['./internal-repository-details-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class InternalRepositoryDetailsInfoComponent implements OnInit {
  @Select(InternalRepositoryDetailsState.internalRepository)
  internalRepository$: Observable<DeferredResource<InternalRepository>>;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly irEditHandlerService: InternalRepositoryEditInfoHandlerService,
  ) {}

  internalRepository: InternalRepository;
  fields: GeneralInfoField[];

  ngOnInit(): void {
    this.internalRepository$
      .pipe(
        filter((resource: DeferredResource<InternalRepository>) => !resource.isPending && !!resource.response),
        map((resource: DeferredResource<InternalRepository>) => resource.response),
        untilDestroyed(this),
      )
      .subscribe((internalRepository: InternalRepository) => {
        this.internalRepository = internalRepository;
        this.fields = this.irEditHandlerService.prepareGeneralInfoFields(internalRepository);
        this.cdr.markForCheck();
      });
  }

  onEdit(fieldId: string) {
    this.irEditHandlerService.editProperty(fieldId, this.internalRepository);
  }
}
