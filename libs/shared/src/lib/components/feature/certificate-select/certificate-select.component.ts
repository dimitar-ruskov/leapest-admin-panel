import {
  Component,
  ChangeDetectionStrategy,
  TrackByFunction,
  Input,
  forwardRef,
  OnChanges,
  SimpleChanges,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {IConfigCertificatesDictionary, IKeyValuePair} from "../../../models/interfaces";
import {DownloadSphinxService} from "../../../utils/services/common";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {CertificatePreviewComponent} from "../certificate-preview/certificate-preview.component";

export interface SelectedCertificate {
  key: string;
  value: string;
  s3Key?: string;
  s3Bucket?: string;
}

@Component({
  selector: 'leap-certificate-select',
  templateUrl: './certificate-select.component.html',
  styleUrls: ['./certificate-select.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CertificateSelectComponent),
      multi: true,
    },
  ],
})
@UntilDestroy()
export class CertificateSelectComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() formControlName: string;
  @Input() certificatesList: IConfigCertificatesDictionary[];
  @Input() editable = true;
  @Input() hideSwitcher = false;
  @Input() hideSelect = false;
  @Input() hideTitleDownload = false;
  @Input() hidePreview = false;
  @Input() switcherValue = true;
  @Output() onSwitch = new EventEmitter<boolean>();

  selectedCertificate: IConfigCertificatesDictionary;
  certificateEnabled: boolean;

  keyValueTrackByFn: TrackByFunction<IKeyValuePair> = (index, item) => item.key;

  get control(): FormControl {
    return this.controlContainer.control.get(this.formControlName) as FormControl;
  }

  private onChange: (value: string) => void = () => {
    /*empty fn*/
  };

  private onTouched = () => {
    /*empty fn*/
  };

  constructor(
    private readonly controlContainer: ControlContainer,
    private readonly cdr: ChangeDetectorRef,
    private readonly downloadSphinxService: DownloadSphinxService,
    private readonly modalService: NzModalService,
  ) {
  }

  ngOnInit(): void {
    this.certificateEnabled = this.hideSwitcher;

    if (this.hideSwitcher && this.control?.value) {
      const {key, value} = this.control.value;
      this.selectedCertificate = {key, value};
    }

    this.control.valueChanges.pipe(untilDestroyed(this)).subscribe((certificateId) => {
      this.selectedCertificate = this.certificatesList?.find(
        (certificate: IConfigCertificatesDictionary) => certificateId === certificate.key,
      );
    });
    this.cdr.detectChanges();
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(certificate: IKeyValuePair): void {
    if (certificate) {
      this.certificateEnabled = this.switcherValue;
      this.onCertificateSelected(certificate.key);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.certificatesList?.currentValue !== changes.certificatesList?.previousValue) {
      if (this.control.value) {
        this.selectedCertificate = this.certificatesList.find(
          (certificate: IConfigCertificatesDictionary) => this.control.value === certificate.key,
        );
      }
    }
  }

  onCertificateSelected(certificateId: string): void {
    this.selectedCertificate = this.certificatesList?.find(
      (certificate: IConfigCertificatesDictionary) => certificateId === certificate.key,
    );
    this.onChange(certificateId);
  }

  public downloadCertificate(): void {
    const link = this.downloadSphinxService.getSphinxUrl(
      this.selectedCertificate.s3Bucket,
      this.selectedCertificate.s3Key,
    );
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  showCertificates(show: boolean): void {
    this.certificateEnabled = show;

    if (!show && this.selectedCertificate && !this.hideSelect) {
      this.selectedCertificate = null;
      this.onChange(null);
    }

    this.onSwitch.emit(this.certificateEnabled);
  }

  public previewCertificate(): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Template Preview',
      nzContent: CertificatePreviewComponent,
      nzComponentParams: {
        s3Bucket: this.selectedCertificate.s3Bucket,
        s3Key: this.selectedCertificate.s3Key,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 900,
      nzFooter: [
        {
          label: 'Close',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Download',
          type: 'primary',
          onClick: () => this.downloadCertificate(),
        },
      ],
    });
  }
}
