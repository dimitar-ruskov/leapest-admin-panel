export interface DictionaryItem {
  key: string;
  value: string;
}

export interface IDictionaries {
  languages: IKeyValuePair[];
  productTypes: IKeyValuePair[];
  deliveryFormats: IKeyValuePair[];
  certificateTypes: IKeyValuePair[];
  timezones?: IKeyValuePair[];
  currencySignsMap?: IKeyValuePair[];
}

export interface IKeyValuePair {
  key: string;
  value: string;
  isDisabled?: boolean;
}
export interface IConfigKeyValuePair {
  configKey: string;
  configValue: string;
}
