import {IPageable} from "../interfaces";

export const DEFAULT_INITIAL_PAGINATION_PARAMS: IPageable = {
  limit: 10,
  page: 1,
  filter: '',
  filterParams: [],
  sort: null
};
