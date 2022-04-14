import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, timer } from 'rxjs';
import { delayWhen, filter, map, retryWhen } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {InternalRepository, InternalRepositoryDTO} from "../../../../../../../../libs/shared/src/lib/models/interfaces";
import {
  GetInternalRepositoryDetails
} from "../../containers/internal-repository-details/state/internal-repository-details.actions";
import {DeferredResource} from "../../../../../../../../libs/shared/src/lib/utils/common";
import {
  GetInternalRepositoryVariants
} from "../../containers/internal-repository-details/state/internal-repository-variants.actions";
import {
  InternalRepositoryService
} from "../../service/internal-repository.service";

@Component({
  selector: 'leap-creation-loader-modal',
  templateUrl: './creation-loader-modal.component.html',
  styleUrls: ['./creation-loader-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class CreationLoaderModalComponent implements OnInit {
  @Input() internalRepo: InternalRepositoryDTO;
  public longLoad = false;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly irService: InternalRepositoryService,
    private readonly modalService: NzModalService,
  ) {}

  public ngOnInit(): void {
    this.isIRCreated(this.internalRepo.parentSKU).subscribe((resp) => {
      if (resp?.response) {
        this.modalService.closeAll();
        this.router.navigate(['admin', 'internal-repository', 'details', this.internalRepo.parentSKU]);
        this.store.dispatch([
          new GetInternalRepositoryVariants({ sku: this.internalRepo.parentSKU }),
          new GetInternalRepositoryDetails(this.internalRepo.parentSKU),
        ]);
      }
    });
  }

  public isIRCreated(parentSKU: string): Observable<DeferredResource<InternalRepository>> {
    let count = 0;
    return this.irService.getInternalRepositoryDetails(parentSKU).pipe(
      filter((x) => !x.isPending),
      map((x) => {
        count++;
        if (count >= 5) {
          this.longLoad = true;
          this.cdr.detectChanges();
        }
        if (x.error && !x.error.ok && x.error.status === 400) {
          throw x;
        }
        return x;
      }),
      retryWhen((errors) => errors.pipe(delayWhen((_) => timer(2000)))),
      untilDestroyed(this),
    );
  }

  public copyToClipboard(): void {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', this.internalRepo?.name);
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }
}