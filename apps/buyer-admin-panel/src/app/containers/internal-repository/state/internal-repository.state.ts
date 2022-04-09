import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import {InternalRepositoryListState} from "../containers/internal-repository-list/state/internal-repository-list.state";
import {
  InternalRepositoryDetailsState
} from "../containers/internal-repository-details/state/internal-repository-details.state";
import {
  InternalRepositoryVariantsState
} from "../containers/internal-repository-details/state/internal-repository-variants.state";
import {
  InternalRepositoryCoursesState
} from "../containers/internal-repository-details/state/internal-repository-courses.state";

@State({
  name: 'internalRepository',
  children: [
    InternalRepositoryListState,
    InternalRepositoryDetailsState,
    InternalRepositoryVariantsState,
    InternalRepositoryCoursesState,
  ]
})
@Injectable()
export class InternalRepositoryState {}
