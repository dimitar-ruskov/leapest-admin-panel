import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { UploadTemplateResp } from '../../../models/certificates/certificate.model';
import { CertificatesService } from '../../../services/certificates/certificates.service';
import {UploadService} from "../../../services/common/upload.service";
import {EnvironmentService} from "../../../services/common/environment.service";

@Component({
  selector: 'leap-certificate-upload-file',
  templateUrl: './certificate-upload-file.component.html',
  styleUrls: ['./certificate-upload-file.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateUploadFileComponent {
  @Input() displayLabel = false;

  public readonly guidelineLink = 'https://my.leapest.com/support?articleId=certificate-templates';
  public readonly allowedUploadFormats = ['.pdf'];

  errorMessage: string;
  invalidTemplate = null;
  uploadedFile: File;

  public uploading = false;

  public s3Key: string;
  public s3Bucket: string;

  constructor(
    private readonly uploadService: UploadService,
    private readonly service: CertificatesService,
    private readonly cdr: ChangeDetectorRef,
    public readonly environmentService: EnvironmentService,
  ) {}


  public get validFile(): boolean {
    return this.uploadedFile && !this.invalidTemplate;
  }

  beforeUpload = (file: File): boolean => {
    const parts = file.name.split('.');
    const ext = `.${parts[parts.length - 1]}`;
    const allowedFormat = this.allowedUploadFormats.includes(ext);
    return allowedFormat;
  };

  uploadFile = (event: any): void => {
    this.uploadService.upload(event.file, this.environmentService.s3Storage).subscribe(
      (resp) => {
        if (resp.type === 'started') {
          this.uploading = true;
          this.cdr.detectChanges();
        }
        if (resp.type === 'progress') {
          event.onProgress(resp.progress);
        } else if (resp.type === 'success') {
          event.onSuccess(event.data);
          this.onUploadTemplate(resp, event.file);
        }
      },
      (error) => {
        event.onError(error);
        this.uploading = false;
        this.cdr.detectChanges();
      },
    );
  };

  private onUploadTemplate(response: UploadTemplateResp, file: File) {
    const rootCsvKey = response.key;
    const rootCsvBucket = response.bucket;
    this.s3Key = rootCsvKey;
    this.s3Bucket = rootCsvBucket;
    this.service.validateCertificateTemplate(this.s3Bucket, this.s3Key).subscribe((res) => {
      this.uploading = false;
      if (res.response && !res.response.participantsNameValid) {
        this.invalidTemplate =
          'Your template does not contain a placeholder for the name of the participant (participant_name), please add this placeholder to your template.';
        this.cdr.detectChanges();
        return;
      } else if (!res.response && res.error) {
        this.invalidTemplate = 'File must be of type pdf';
        this.cdr.detectChanges();
        return;
      } else if (!res || res?.error) {
        this.invalidTemplate = res?.error?.message;
        this.cdr.detectChanges();
        return;
      }
      this.invalidTemplate = null;
      this.uploadedFile = file;
      this.cdr.detectChanges();
    });
  }

  removeTemplate(): void {
    this.uploadedFile = null;
    this.invalidTemplate = null;
  }
}
