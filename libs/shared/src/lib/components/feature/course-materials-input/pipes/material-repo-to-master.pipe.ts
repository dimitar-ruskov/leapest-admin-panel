import { Pipe, PipeTransform } from '@angular/core';
import {InternalRepositoryMaterial, MasterInternalRepository} from "../../../../models";

@Pipe({
  name: 'materialRepoToMaster',
})
export class MaterialRepoToMasterPipe implements PipeTransform {
  transform(internalRepository: InternalRepositoryMaterial): MasterInternalRepository {
    return {
      languages: internalRepository.internalRepositoryDTOs.map((i) => i.language),
      types: internalRepository.internalRepositoryDTOs.map((i) => i.type),
      name: internalRepository.name,
      id: internalRepository.id,
      sku: internalRepository.sku,
      isExist: internalRepository.isExist,
      defaultVariant: internalRepository.defaultVariant,
    };
  }
}
