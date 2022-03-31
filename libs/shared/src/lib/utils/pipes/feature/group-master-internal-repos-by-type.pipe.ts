import { Pipe, PipeTransform } from '@angular/core';
import { InternalRepositoryMaterial } from '../../models/internal-repository.model';


@Pipe({
  name: 'groupMasterInternalReposByType'
})
export class GroupMasterInternalReposByTypePipe implements PipeTransform {

  transform(masterInternalRepositories: InternalRepositoryMaterial[]): {
    material: InternalRepositoryMaterial[],
    exam: InternalRepositoryMaterial[]
  } {
    const groups = { material: [], exam: [] };

    if (masterInternalRepositories && Array.isArray(masterInternalRepositories) && masterInternalRepositories.length) {
      masterInternalRepositories.forEach((mir) => {
        const userType = mir.userType.configKey;
        if (userType === 'learner') {
          const type = mir.type.configKey;
          const group = type.includes('exam') ? 'exam' : 'material';

          groups[group].push(mir);
        }
      });
    }

    return groups;
  }
}
