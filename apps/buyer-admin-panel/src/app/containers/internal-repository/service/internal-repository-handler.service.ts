import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import {InternalRepositoryDTO} from "../../../../../../../libs/shared/src/lib/models/interfaces";
import {
  CreationLoaderModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/creation-loader-modal/creation-loader-modal.component";

@Injectable({
  providedIn: 'root',
})
export class InternalRepositoryHandlerService {
  constructor(private readonly modalService: NzModalService) {}

  waitModal(internalRepo: InternalRepositoryDTO) {
    return this.modalService.create({
      nzContent: CreationLoaderModalComponent,
      nzComponentParams: { internalRepo },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: null,
    });
  }
}
