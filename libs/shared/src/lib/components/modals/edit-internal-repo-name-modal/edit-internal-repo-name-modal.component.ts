import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {IKeyValuePair} from "../../../models";
import {AdminCoursesService} from "../../../utils/services";

@Component({
  selector: 'leap-edit-internal-repo-name-modal',
  templateUrl: './edit-internal-repo-name-modal.component.html',
  styleUrls: ['./edit-internal-repo-name-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditInternalRepoNameModalComponent implements OnInit {
  form: FormGroup;
  @Input() modalExplanation: string;
  @Input() mainLabel: string;
  @Input() subLabel: string;
  @Input() initVal = '';
  @Input() minLength = 6;
  @Input() maxLength = 40;
  @Input() type: IKeyValuePair;

  constructor(private readonly fb: FormBuilder, private readonly adminCoursesService: AdminCoursesService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      textInput: [
        this.initVal,
        [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)],
        [
          this.adminCoursesService.existingNameAsyncValidator({
            ignore: this.initVal,
            type: this.type && this.type.value ? this.type.value : '',
          }),
        ],
      ],
    });
  }
}
