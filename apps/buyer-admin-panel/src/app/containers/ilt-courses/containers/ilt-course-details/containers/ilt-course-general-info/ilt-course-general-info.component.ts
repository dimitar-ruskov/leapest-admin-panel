import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { PublishToLxpByDomain } from '../../state/ilt-course-details.actions';
import { IltCourseDetailsState } from '../../state/ilt-course-details.state';
import {DeferredResource} from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  PublishCourseToLXP,
  PublishedILTCourse
} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";


@Component({
  selector: 'leap-ilt-course-general-info',
  templateUrl: './ilt-course-general-info.component.html',
  styleUrls: ['./ilt-course-general-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IltCourseGeneralInfoComponent {
  @Select(IltCourseDetailsState.iltCourse)
  iltCourse$: Observable<DeferredResource<PublishedILTCourse>>;

  constructor(private readonly store: Store) {}

  publishCourse(payload: PublishCourseToLXP): void {
    this.store.dispatch(new PublishToLxpByDomain(payload));
  }
}
