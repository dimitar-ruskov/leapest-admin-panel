import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import {InstructorsListState} from "../containers/instructors-list/state/instructors-list.state";
import {InstructorDetailsState} from "../containers/instructor-details/state/instructor-details.state";


@State({
  name: 'instructors',
  children: [InstructorsListState, InstructorDetailsState]
})
@Injectable()
export class InstructorsState {}
