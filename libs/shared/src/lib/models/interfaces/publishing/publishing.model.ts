import {IKeyValuePair} from "../common/dictionary.model";

export interface IPublishingSettings {
  configValue: string;
  configType: string;
  systemConfig: boolean;
  channels: IKeyValuePair[];
  groups: IKeyValuePair[];
  lxpPrivate: boolean;
  disabled: boolean;
  defaultVariant: { configKey: string; configValue: string };
  passRate?: number;
  lxpRestrictUsers: string[];
  lxpRestrictGroups: string[];
  id?: string;
  internalRepositorySettingType?: { configKey: string };
}

export interface IPublishingTab {
  key: string;
  text: string;
  value: IPublishingSettings;
}
