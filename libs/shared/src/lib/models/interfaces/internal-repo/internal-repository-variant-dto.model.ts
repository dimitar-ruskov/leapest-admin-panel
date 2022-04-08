import { ConfigDto } from 'src/app/admin-panel/models/config-dto.model';
import { IRContent } from 'src/app/admin-panel/models/internal-repository.model';

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
