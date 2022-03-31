import { Observable } from 'rxjs';

export type TFormControlType = 'text' | 'text-area' | 'select' | 'radio' | 'number' | 'rich-text' | 'multi-select';

export interface TFormControlConfigOption {
  key: any;
  value: string;
  extra?: string;
  iconClass?: string;
}

export interface TFormControlConfig {
  name?: string;
  type: TFormControlType;
  // required for select and radio
  options?: Observable<TFormControlConfigOption[]>;
  // can be used with select
  showCreateNewOptionButton?: boolean;
  // flag for showing * label
  required?: boolean;
  // flag for showing Optional label
  optional?: boolean;
  label?: string;
  subLabel?: string;
  placeHolder?: string;
  // required for rich-text
  quillConfig?: any;
  charLimit?: number;
  ////////////////////////
  // required for multi-select
  serverSideFilterFn?: (filter: string) => Observable<TFormControlConfigOption[]>;
  initialTags?: string[];

  errorMsgs?: { key: string; value: string }[];
}
export interface TFormInputModel {
  controls: TFormControlConfig[];
  buttons?: { label: string; type: string; action: string }[];
}
