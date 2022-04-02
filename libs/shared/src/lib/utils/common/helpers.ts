import { NzTableQueryParams, NzTableSortOrder } from 'ng-zorro-antd/table';
import {IFilterSelectedDates, IKeyValuePair, IPageable, Venue} from "../../models/interfaces";


export function formatDate(date: Date, time: Date): string {
  if (!date || !time) {
    return 'N/A';
  }

  const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
  const day = (date.getDate()) < 10 ? '0' + date.getDate() : date.getDate().toString();
  const hours = (time.getHours()) < 10 ? '0' + time.getHours() : time.getHours().toString();
  const minutes = (time.getMinutes()) < 10 ? '0' + time.getMinutes() : time.getMinutes().toString();
  const seconds = (time.getSeconds()) < 10 ? '0' + time.getSeconds() : time.getSeconds().toString();

  return (date.getFullYear() + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds);
}

export function createPageableFromTableQueryParams(queryParams: NzTableQueryParams): IPageable {
  return {
    limit: queryParams.pageSize,
    page: queryParams.pageIndex,
    sort: queryParams.sort.find(({ value }: {key: string, value: NzTableSortOrder}) => {
      return !!value;
    }) || null,
    filterParams: queryParams.filter
  };
}

export function createFiltersFromDateRangeSelect(selectedDates: (Date | null)[]): IFilterSelectedDates[] {
  return selectedDates.map((el: Date | null, idx: number): IFilterSelectedDates => ({
      key: idx === 0 ? 'startDate' : 'endDate',
      value: [
        idx === 0 ?
          new Date(selectedDates[idx].setUTCHours(0, 0, 0)).toISOString() :
          new Date(selectedDates[idx].setUTCHours(23, 59, 59)).toISOString()
      ]
    })
  );
}

export function areFilterParamsEqual(
  previous: {key: string, value: string[]}[],
  current: {key: string, value: string[]}[]
): boolean {
  if (previous && current && previous.length === current.length) {
    return previous.every((filterParam, index) => {
      return filterParam.value.toString() === current[index].value.toString();
    });
  }

  return false;
}

export function getOptionsFromMap(optionsMap: Map<boolean, string>): IKeyValuePair[] {
  const options = [];

  optionsMap.forEach((value, key) => {
    options.push({ key, value });
  });

  return options;
}

export function getFullAddress(d: Venue): string {
  return d.address
    + (d.houseNumber ? ' ' + d.houseNumber : '')
    + (d.room ? ', Room ' + d.room : '')
    + ', '
    + d.city
    + ', '
    + (d.state ? d.state + ', ' : '')
    + (d.province ? d.province + ', ' : '')
    + d.country
    + ', '
    + (d.postalCode ? d.postalCode : '');
}
