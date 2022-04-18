import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import {InternalRepositoryDTO} from "../../../models";
import {
  CreationLoaderModalComponent
} from "../../components/feature/internal-repo/creation-loader-modal/creation-loader-modal.component";

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
