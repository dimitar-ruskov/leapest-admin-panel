import {ConfigDto} from "../common/config-dto.model";
import {IRContent} from "./internal-repository.model";

export interface InternalRepositoryVariantDTO {
  language: ConfigDto;
  contents: IRContent[];
  lastUpdated: string;
  name: string;
  deletable: boolean;
  occurrenceCounter: number;
  sku: string;
  type: ConfigDto;
  id: number;
  deliverableId: number;
}
