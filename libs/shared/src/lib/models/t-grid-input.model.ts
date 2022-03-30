import { NgStyle } from '@angular/common';

export interface TGridAction {
  icon: string;
  key: string;
  tooltipText?: (item: any) => string;
  dangerType?: boolean;
  disabled?: (item: any) => boolean;
}
export interface TGridEmptyConfig {
  emptyText: string;
  emptyAction?: { label: string; type: string };
}

export interface TGridInputSetterResult {
  prefixIcon?: string;
  prefixImg?: string;
  value: string;
  style?: NgStyle;
}

export interface TGridInputModel {
  // headers and setters must be aligned
  headers: {
    sortable: boolean;
    key: string;
    value: string;
    weight: string;
    filters?: { text: string; value: string }[];
  }[];
  setters: ((item: any) => TGridInputSetterResult)[];
  actions?: TGridAction[];
  rowCTA?: boolean;
  rowCTATooltipText?: string;
  emptyConfig?: TGridEmptyConfig;
}
