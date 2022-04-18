import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';

import {PublishToLxpByDomain} from "../../state/sp-course-details.actions";
import {SpCourseDetailsState} from "../../state/sp-course-details.state";

import {DeferredResource} from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {PublishCourseToLXP} from "../../../../../../../../../../libs/shared/src/lib/models";
import {
  ActiveSelfPacedCourse
} from "../../../../../../../../../../libs/shared/src/lib/models/courses/sp-courses/sp-course.model";

@Component({
  selector: 'leap-sp-course-general-info',
  templateUrl: './sp-course-general-info.component.html',
  styleUrls: ['./sp-course-general-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class SpCourseGeneralInfoComponent {
  @Select(SpCourseDetailsState.selfPacedCourse)
  selfPacedCourse$: Observable<DeferredResource<ActiveSelfPacedCourse> | null>;

  constructor(private readonly store: Store) {}

  publishCourse(payload: PublishCourseToLXP): void {
    this.store.dispatch(new PublishToLxpByDomain(payload));
  }
}
