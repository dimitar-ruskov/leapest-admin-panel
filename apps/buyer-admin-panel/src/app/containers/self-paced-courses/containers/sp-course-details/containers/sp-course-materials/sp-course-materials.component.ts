import { Component, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

import { SpCourseDetailsState } from '../../state/sp-course-details.state';
import {MasterInternalRepository} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";

@Component({
  selector: 'leap-sp-course-materials',
  templateUrl: './sp-course-materials.component.html',
  styleUrls: ['./sp-course-materials.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpCourseMaterialsComponent {
  @Select(SpCourseDetailsState.selfPacedCourseMaterials) materials$: Observable<MasterInternalRepository[]>;

  trackByFn: TrackByFunction<MasterInternalRepository> = (index, item) => item.id;
}
