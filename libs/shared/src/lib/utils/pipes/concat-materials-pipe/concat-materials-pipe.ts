import { Pipe, PipeTransform } from '@angular/core';
import {FlattenedCourseDetails, InternalRepositoryMaterial} from "../../../models/interfaces";

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
