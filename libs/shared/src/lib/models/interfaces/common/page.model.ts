import { IKeyValuePair } from 'src/app/core/model/dictionary.model';

export interface IPageable {
    limit?: number;
    page?: number;
    filter?: string;
    filterParams?: { value: string[], key: string }[];
    sort?: IKeyValuePair;
}
