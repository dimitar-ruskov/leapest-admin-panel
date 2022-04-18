export interface FilterParamList {
  text: string;
  value: string;
  selected?: boolean;
}

export interface FilterList {
  key: string;
  value: string[];
}

export interface ILabeledItem {
  id: string;
  value?: string;
}

export interface ListFilters {
  trigger: ILabeledItem[];
  venue: ILabeledItem[];
  recipient: ILabeledItem[];
}
