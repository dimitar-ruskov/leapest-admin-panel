import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

import {IGlobalStateModel} from "../../../../../../state/state.model";

import {IKeyValuePair} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {
  IPublishingSettings
} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces/publishing/publishing.model";
import {COURSE_PUBLISH_STATUS} from "../../../../../../../../../../libs/shared/src/lib/models/constants";
import {LxpUsersService} from "../../../../../../../../../../libs/shared/src/lib/utils/services";

@Component({
  selector: 'leap-publishing-settings',
  templateUrl: './publishing-settings.component.html',
  styleUrls: ['./publishing-settings.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class PublishingSettingsComponent implements OnInit {
  private _settings: IPublishingSettings;
  @Input() type: string;
  @Input()
  set settings(val: IPublishingSettings) {
    this._settings = val;
    this.formInit();
  }

  get settings(): IPublishingSettings {
    return this._settings;
  }

  @Output() editSetting: EventEmitter<IPublishingSettings> = new EventEmitter<IPublishingSettings>();

  @Select((state: IGlobalStateModel) => state.core.internalRepositoryLanguages)
  iltLanguageDictionary$: Observable<IKeyValuePair[]>;

  languageDict: any;

  form: FormGroup;
  coursePublishStatus = COURSE_PUBLISH_STATUS;
  lxpPrivateControl: FormControl;
  lxpRestrictUsersControl: FormControl;
  lxpRestrictGroupsControl: FormControl;
  lxpRestrictChannelsControl: FormControl;
  lxpRestrictPublishGroupsControl: FormControl;
  lxpDefaultPassRateControl: FormControl;
  lxpDefaultLanguageControl: FormControl;
  lxpUsers$: Observable<IKeyValuePair[]>;
  lxpGroups$: Observable<IKeyValuePair[]>;
  lxpChannels$: Observable<IKeyValuePair[]>;

  constructor(private readonly fb: FormBuilder, private readonly lxpUsersService: LxpUsersService) {}

  ngOnInit(): void {
    this.iltLanguageDictionary$.pipe(untilDestroyed(this)).subscribe((levels) => {
      this.languageDict = levels;
    });
    this.formInit();
    this.getLxpChannels(null);
    this.getLxpGroups(null);
  }

  public formInit(): void {
    let group: any;
    if (this.settings) {
      group = {
        lxpPrivate: [this.settings.lxpPrivate, Validators.required],
        lxpRestrictUsers: [this.settings.lxpRestrictUsers],
        lxpRestrictGroups: [this.settings.lxpRestrictGroups],
        groups: [this.settings.groups],
        channels: [this.settings.channels],
        passRate: [this.settings.passRate, [Validators.min(0), Validators.max(100)]],
        language: [this.settings.defaultVariant?.configValue],
      };
    } else {
      group = {
        lxpPrivate: [true, Validators.required],
        lxpRestrictUsers: [null],
        lxpRestrictGroups: [null],
        groups: [null],
        channels: [null],
        passRate: [null, [Validators.min(0), Validators.max(100)]],
        language: [null],
      };
    }
    this.form = this.fb.group(group);

    this.lxpPrivateControl = this.form.get('lxpPrivate') as FormControl;
    this.lxpRestrictUsersControl = this.form.get('lxpRestrictUsers') as FormControl;
    this.lxpRestrictGroupsControl = this.form.get('lxpRestrictGroups') as FormControl;
    this.lxpRestrictChannelsControl = this.form.get('channels') as FormControl;
    this.lxpRestrictPublishGroupsControl = this.form.get('groups') as FormControl;
    this.lxpDefaultPassRateControl = this.form.get('passRate') as FormControl;
    this.lxpDefaultLanguageControl = this.form.get('language') as FormControl;
  }

  public getLxpChannels(filter: string): void {
    this.lxpChannels$ = this.lxpUsersService.getLxpChannels(filter);
  }

  private getLxpGroups(filter: string): void {
    this.lxpGroups$ = this.lxpUsersService.getLxpGroups(filter);
  }

  public onInputLxpUsers(filter: string): void {
    if (filter && filter.length > 2) {
      this.lxpUsers$ = this.lxpUsersService.getLxpUsers(filter);
    }
  }

  public onInputLxpGroups(filter: string): void {
    if (filter && filter.length > 2) {
      this.getLxpGroups(filter);
    }
  }

  public get lxpUsersCount(): number {
    return this.lxpRestrictUsersControl && this.lxpRestrictUsersControl.value
      ? this.lxpRestrictUsersControl.value.length
      : 0;
  }

  public get lxpGroupsCount(): number {
    return this.lxpRestrictGroupsControl && this.lxpRestrictGroupsControl.value
      ? this.lxpRestrictGroupsControl.value.length
      : 0;
  }

  public get lxpChannelsCount(): number {
    return this.lxpRestrictChannelsControl && this.lxpRestrictChannelsControl.value
      ? this.lxpRestrictChannelsControl.value.length
      : 0;
  }

  public get lxpPublishGroupsCount(): number {
    return this.lxpRestrictPublishGroupsControl && this.lxpRestrictPublishGroupsControl.value
      ? this.lxpRestrictPublishGroupsControl.value.length
      : 0;
  }

  public onRemoveUser(val, key: string) {
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
    this.form.markAsDirty();
  }

  public saveChanges(): void {
    const formValue = this.form.getRawValue();
    const updatedSettings = {
      ...formValue,
      id: this.settings?.id,
      internalRepositorySettingType: { configKey: this.type },
      defaultVariant: {
        configKey: formValue.language ? this.languageDict.find((i) => i.value === formValue.language).key : null,
      },
    };

    this.editSetting.emit(updatedSettings);
  }
}
