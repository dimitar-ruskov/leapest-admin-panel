import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OktaAuthStateService } from '@okta/okta-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { UploadService } from "../../../services/common/upload.service";
import { EnvironmentService } from "../../../services/common/environment.service";

@Component({
  selector: 'leap-bulk-upload-modal',
  templateUrl: './bulk-upload-modal.component.html',
  styleUrls: ['./bulk-upload-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class BulkUploadModalComponent implements OnInit {
  public form: FormGroup;
  maxFileSize = 100;
  maxFilesCount = 1;
  readonly allowedUploadFormat: string = '.csv';
  fileList: [];
  s3Key: string;
  s3Bucket: string;
  domain: string;
  sku: string;
  templateLink: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly uploadService: UploadService,
    private readonly cdr: ChangeDetectorRef,
    public environment: EnvironmentService,
    private readonly oktaAuthStateService: OktaAuthStateService,
  ) {}

  async ngOnInit() {
    this.templateLink = `${this.environment.s3Url}/${this.environment.umbrellaUploadsBucket}/Course_Event_Bulk_Upload_Template_Data.csv`;

    this.form = this.fb.group({
      fileName: [null, [Validators.required, Validators.maxLength(40), Validators.minLength(5)]],
      s3Key: [null, [Validators.required]],
      s3Bucket: [null, [Validators.required]],
    });

    const oktaUser = await this.oktaAuthStateService['oktaAuth'].getUser();
    this.domain = oktaUser['mkpDomain'];
  }

  public beforeUpload = (file: File) => {
    const parts = file.name.split('.');
    const ext = `.${parts[parts.length - 1]}`;
    let allowedFormat = true;
    if (this.allowedUploadFormat) {
      allowedFormat = this.allowedUploadFormat.split(',').includes(ext);
    }
    const isLt2M = file.size / 1024 / 1024 < this.maxFileSize;
    return allowedFormat && isLt2M;
  };

  handleChange(info): void {
    this.fileList = info.fileList;
    if (info.type === 'removed') {
      this.form.controls.s3Key.setValue(null);
      this.form.controls.s3Bucket.setValue(null);
    }
  }

  removeCSV(): void {
    this.fileList = [];
    this.form.controls.s3Key.setValue(null);
    this.form.controls.s3Bucket.setValue(null);
  }

  uploadFile = (event: any) => {
    this.uploadService
      .upload(event.file, this.environment.umbrellaUploadsBucket, true, this.domain)
      .pipe(untilDestroyed(this))
      .subscribe(
        (resp) => {
          if (resp.type === 'started') {
            this.cdr.detectChanges();
          }
          if (resp.type === 'progress') {
            event.onProgress(resp.progress);
          } else if (resp.type === 'success') {
            event.onSuccess(event.data);
            this.onUploadCSV(resp, event.file);
            this.cdr.markForCheck();
          }
          this.cdr.markForCheck();
        },
        (error) => {
          event.onError(error);
          this.cdr.markForCheck();
        },
      );
  };

  private onUploadCSV(response: any, file: File) {
    this.form.controls.s3Key.patchValue(response.key);
    this.form.controls.s3Bucket.patchValue(response.bucket);
  }
}
