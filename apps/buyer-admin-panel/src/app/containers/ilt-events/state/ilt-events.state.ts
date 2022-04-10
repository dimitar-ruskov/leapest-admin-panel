import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';

import {IltEventsCreateState} from "../containers/ilt-events-create/state/ilt-events-create.state";
import {IltEventsListState} from "../containers/ilt-events-list/state/ilt-events.state";
import {IltEventDetailsState} from "../containers/ilt-events-details/state/ilt-event-details.state";

@State({
  name: 'iltEvents',
  children: [
    IltEventsCreateState,
    IltEventsListState,
    IltEventDetailsState
  ]
})
@Injectable()
export class IltEventsState {}
