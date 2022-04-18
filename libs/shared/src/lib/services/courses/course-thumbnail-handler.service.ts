import { Injectable } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {EnvironmentService, UploadService} from "../common";
import {S3BucketData} from "../../models";
import {
  UploadThumbnailModalComponent
} from "../../components/modals/upload-thumbnail-modal/upload-thumbnail-modal.component";

@Injectable({
  providedIn: 'root'
})
export class CourseThumbnailHandlerService {

  constructor(private readonly modalService: NzModalService,
              private readonly uploadService: UploadService,
              private readonly environmentService: EnvironmentService) {
  }

  generateThumbnail<A>(dispatchAction: () => Observable<A>): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Generate Thumbnail?',
      nzContent: 'You are about to generate a new thumbnail.\n' +
        'Please, be aware this will overwrite any previous thumbnail that you may have uploaded.\n' +
        'How do you wish to proceed?',
      nzWrapClassName: 'modal-class',
      nzBodyStyle: { whiteSpace: 'pre-line' },
      nzWidth: 660,
      nzOkText: 'Generate Thumbnail',
      nzOnOk: () => {
        return dispatchAction().toPromise().then(_ => modal.destroy());
      }
    });
  }

  uploadThumbnail<A>(thumbnailUrl: string, dispatchAction: (s3BucketData: S3BucketData) => Observable<A>): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Upload Custom Thumbnail',
      nzContent: UploadThumbnailModalComponent,
      nzComponentParams: {
        data: {
          currentThumbnail: thumbnailUrl,
          type: ['.png', '.jpg', '.jpeg'],
          dimensions: {
            width: 640,
            height: 480,
            comp: 'geq',
            ratio: 4 / 3
          }
        }
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'text',
          onClick: () => modal.destroy()
        }, {
          label: 'Proceed',
          type: 'primary',
          disabled: (d) => !d.file,
          onClick: (data) => {
            return this.uploadService.upload(data.file, this.environmentService.aws.sellerProductUploadsBucket)
              .pipe(switchMap((resp) => {
                 return resp.type === 'success' ? dispatchAction(resp) : of(null);
              }))
              .toPromise().then(_ => modal.destroy());
          }
        }
      ]
    });
  }
}
