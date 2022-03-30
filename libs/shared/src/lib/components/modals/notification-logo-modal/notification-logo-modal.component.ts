import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { NzUploadFile } from 'ng-zorro-antd/upload/interface';
import { EnvironmentService, UploadService } from '../../../../snatch/services';
import { DownloadSphinxService } from '../../../../snatch/services/download-sphinx.service';

@Component({
  selector: 'leap-notification-logo-modal',
  templateUrl: './notification-logo-modal.component.html',
  styleUrls: ['./notification-logo-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationLogoModalComponent implements OnInit {
  uploading: boolean;
  s3Key: string;
  s3Bucket: string;
  invalidFile: string;
  uploadedFile: NzUploadFile;
  previewImage: string;

  readonly allowedUploadFormats = ['.jpg', '.png'];

  get isFileUploaded(): boolean {
    return !!this.uploadedFile;
  }

  constructor(
    private readonly uploadService: UploadService,
    private readonly cdr: ChangeDetectorRef,
    public readonly environmentService: EnvironmentService,
    private readonly downloadSphinxService: DownloadSphinxService,
  ) {}

  ngOnInit(): void {}

  beforeUpload = (file: NzUploadFile): boolean => {
    const parts = file.name.split('.');
    const ext = `.${parts[parts.length - 1]}`;
    const allowedFormat = this.allowedUploadFormats.includes(ext);
    return allowedFormat;
  };

  // typing mismatch between NzUploadFile and File interfaces
  uploadFile = (event: any): Subscription => {
    return this.uploadService.upload(event.file, this.environmentService.s3Storage).subscribe(
      (response: { bucket: string; key: string; type: string }) => {
        if (response.type === 'started') {
          this.uploading = true;
          this.cdr.detectChanges();
        } else if (response.type === 'success') {
          event.onSuccess(event.data);
          this.onUploadFile(response, event.file);
          this.previewImage = this.getPreviewLogoLink(response.bucket, response.key);
          this.uploading = false;
          this.cdr.detectChanges();
        }
      },
      (error) => {
        event.onError(error);
        this.uploading = false;
        this.cdr.detectChanges();
      },
    );
  };

  removeFile(): void {
    this.uploadedFile = null;
  }

  private onUploadFile(response: { bucket: string; key: string; type: string }, file: NzUploadFile) {
    this.s3Key = response.key;
    this.s3Bucket = response.bucket;
    this.uploadedFile = file;
    this.cdr.detectChanges();
  }

  private getPreviewLogoLink(bucket: string, key: string) {
    return this.downloadSphinxService.getSphinxUrl(bucket, key);
  }
}
