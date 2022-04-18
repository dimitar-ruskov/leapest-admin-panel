import {IKeyValuePair} from "./dictionary.model";

export interface IPageable {
    limit?: number;
    page?: number;
    filter?: string;
    filterParams?: { value: string[], key: string }[];
    sort?: IKeyValuePair;
}
