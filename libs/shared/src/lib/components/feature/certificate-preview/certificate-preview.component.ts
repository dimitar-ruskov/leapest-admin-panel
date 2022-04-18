import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import {DownloadSphinxService} from "../../../services/common";

@Component({
  selector: 'leap-certificate-preview',
  templateUrl: './certificate-preview.component.html',
  styleUrls: ['./certificate-preview.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificatePreviewComponent implements OnInit {
  @Input() s3Bucket: string;
  @Input() s3Key: string;
  public link: string;
  public isLoading = true;

  constructor(
    private readonly downloadSphinxService: DownloadSphinxService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const link = this.downloadSphinxService.getSphinxUrl(this.s3Bucket, this.s3Key);

    if (link) {
      this.downloadSphinxService.downloadPDF(link).subscribe((res) => {
        const file = new Blob([res], { type: 'application/pdf' });
        this.link = URL.createObjectURL(file) + '#toolbar=0&navpanes=0&scrollbar=0&view=Fit';
        this.isLoading = false;
        this.cdr.markForCheck();
      });
    }
  }
}
