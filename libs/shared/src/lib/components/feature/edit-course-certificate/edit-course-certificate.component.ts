import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { IKeyValuePair } from "../../../models";

@Component({
  selector: 'leap-edit-course-certificate',
  templateUrl: './edit-course-certificate.component.html',
  styleUrls: ['./edit-course-certificate.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCourseCertificateComponent implements OnInit {
  @Input() currentCertificate: any;
  @Input() isCourse = false;
  @Input() isEvent = false;
  @Input() switcherValue = true;

  certificatesList: IKeyValuePair[];
  selectedCertificate: any;
  form: FormGroup = this.fb.group({
    certificate: [null],
  });

  @Select(state => state.core.certificatesDictionary)
  certificatesDictionary$: Observable<IKeyValuePair[]>;

  constructor(private readonly fb: FormBuilder) {}

  get certificate(): FormControl {
    return this.form.get('certificate') as FormControl;
  }

  get isEnabled(): boolean {
    return this.switcherValue;
  }

  get description(): string {
    if (this.isEvent) {
      return 'Do you wish to enable the delivery of the certificate shown below? The certificate will be automatically sent to learners at the end of the course event.';
    } else {
      return 'Select an existing certificate or click <a href=\'hw/admin/certificates\'>here to upload a new one</a> (this will send you to a different page). Please note that any changes will only be applied to newly scheduled events.';
    }
  }

  ngOnInit(): void {
    if (this.currentCertificate) {
      this.selectedCertificate = { key: this.currentCertificate.id, value: this.currentCertificate.displayName };
      this.form.patchValue({
        certificate: this.selectedCertificate,
      });
    }
  }

  public onSwitch(value: boolean): void {
    this.switcherValue = value;
  }
}
