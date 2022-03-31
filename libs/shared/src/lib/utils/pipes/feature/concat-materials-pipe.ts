import { Pipe, PipeTransform } from '@angular/core';
import { InternalRepositoryMaterial } from '../../models/internal-repository.model';
import { FlattenedCourseDetails } from '../../models/ilt-event.model';

@Pipe({
  name: 'concatMaterialsPipe',
})
export class ConcatMaterialsPipe implements PipeTransform {
  transform(course: FlattenedCourseDetails): InternalRepositoryMaterial[] {
    if (!course) {
      return [];
    }
    const { additionalMasterInternalRepositories, masterInternalRepositories, marketplaceMaterials } = course;
    return [...additionalMasterInternalRepositories, ...masterInternalRepositories, ...marketplaceMaterials];
  }
}
