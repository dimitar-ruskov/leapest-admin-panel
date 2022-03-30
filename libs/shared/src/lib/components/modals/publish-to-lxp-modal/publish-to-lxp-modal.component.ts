import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IKeyValuePair } from 'src/app/core/model/dictionary.model';
import { COURSE_PUBLISH_STATUS } from '../../../common/constants/course-publist-status';
import { AdminCoursesService } from '../../../services/admin-courses.service';

@Component({
  selector: 'leap-publish-to-lxp-modal',
  templateUrl: './publish-to-lxp-modal.component.html',
  styleUrls: ['./publish-to-lxp-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishToLxpModalComponent implements OnInit {
  @Input() name: string;
  @Input() specificExternalSKU: boolean;
  @Input() externalSKU: string;

  form: FormGroup;
  coursePublishStatus = COURSE_PUBLISH_STATUS;
  lxpPrivateControl: FormControl;
  lxpRestrictUsersControl: FormControl;
  lxpRestrictGroupsControl: FormControl;
  lxpRestrictChannelsControl: FormControl;
  lxpRestrictPublishGroupsControl: FormControl;
  lxpUsers$: Observable<IKeyValuePair[]>;
  lxpGroups$: Observable<IKeyValuePair[]>;
  lxpChannels$: Observable<IKeyValuePair[]>;

  constructor(private readonly fb: FormBuilder, private readonly adminCoursesService: AdminCoursesService) {}

  ngOnInit(): void {
    const group: any = {
      lxpPrivate: [true, Validators.required],
      lxpRestrictUsers: [null],
      lxpRestrictGroups: [null],
      lxpGroups: [null],
      lxpChannels: [null],
    };
    if (this.specificExternalSKU) {
      group.externalSKU = [
        this.externalSKU,
        [Validators.required, Validators.pattern(/^[A-Z0-9]+$/i), Validators.minLength(4), Validators.maxLength(8)],
        [this.adminCoursesService.existingSKUAsyncValidator(true, this.externalSKU)],
      ];
    }

    this.form = this.fb.group(group);

    this.lxpPrivateControl = this.form.get('lxpPrivate') as FormControl;
    this.lxpRestrictUsersControl = this.form.get('lxpRestrictUsers') as FormControl;
    this.lxpRestrictGroupsControl = this.form.get('lxpRestrictGroups') as FormControl;
    this.lxpRestrictChannelsControl = this.form.get('lxpChannels') as FormControl;
    this.lxpRestrictPublishGroupsControl = this.form.get('lxpGroups') as FormControl;

    this.getLxpChannels(null);
    this.getLxpGroups(null);
  }

  onInputLxpUsers(filter: string): void {
    if (filter && filter.length > 2) {
      this.lxpUsers$ = this.adminCoursesService.getLxpUsers(filter);
    }
  }

  onInputLxpGroups(filter: string): void {
    if (filter && filter.length > 2) {
      this.getLxpGroups(filter);
    }
  }

  getLxpChannels(filter: string): void {
    this.lxpChannels$ = this.adminCoursesService.getLxpChannels(filter);
  }

  getLxpGroups(filter: string): void {
    this.lxpGroups$ = this.adminCoursesService.getLxpGroups(filter);
  }

  get lxpUsersCount(): number {
    return this.lxpRestrictUsersControl && this.lxpRestrictUsersControl.value
      ? this.lxpRestrictUsersControl.value.length
      : 0;
  }

  get lxpGroupsCount(): number {
    return this.lxpRestrictGroupsControl && this.lxpRestrictGroupsControl.value
      ? this.lxpRestrictGroupsControl.value.length
      : 0;
  }

  get lxpChannelsCount(): number {
    return this.lxpRestrictChannelsControl && this.lxpRestrictChannelsControl.value
      ? this.lxpRestrictChannelsControl.value.length
      : 0;
  }

  get lxpPublishGroupsCount(): number {
    return this.lxpRestrictPublishGroupsControl && this.lxpRestrictPublishGroupsControl.value
      ? this.lxpRestrictPublishGroupsControl.value.length
      : 0;
  }

  onRemoveUser(val, key: string) {
    let kValue;
    let kIndex;
    switch (key) {
      case 'user':
        kValue = [...this.lxpRestrictUsersControl.value];
        kIndex = kValue.findIndex((k) => k === val);
        kValue.splice(kIndex, 1);
        this.lxpRestrictUsersControl.patchValue(kValue);
        break;
      case 'group':
        kValue = [...this.lxpRestrictGroupsControl.value];
        kIndex = kValue.findIndex((k) => k === val);
        kValue.splice(kIndex, 1);
        this.lxpRestrictGroupsControl.patchValue(kValue);
        break;
      case 'channel':
        kValue = [...this.lxpRestrictChannelsControl.value];
        kIndex = kValue.findIndex((k) => k.key === val.key);
        kValue.splice(kIndex, 1);
        this.lxpRestrictChannelsControl.patchValue(kValue);
        break;
      case 'publishGroup':
        kValue = [...this.lxpRestrictPublishGroupsControl.value];
        kIndex = kValue.findIndex((k) => k.key === val.key);
        kValue.splice(kIndex, 1);
        this.lxpRestrictPublishGroupsControl.patchValue(kValue);
        break;
    }
  }
}
