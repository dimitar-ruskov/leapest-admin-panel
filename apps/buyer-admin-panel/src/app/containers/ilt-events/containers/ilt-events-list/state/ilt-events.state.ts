import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ActiveIltEventsState } from '../active-ilt-events-list/state/active-ilt-events.state';
import { DraftIltEventsState } from '../draft-ilt-events-list/state/draft-ilt-events.state';
import { FinishedIltEventsState } from '../finished-ilt-events-list/state/finished-ilt-events.state';
import { ChangeILTEventsListTab } from './ilt-events.actions';

export class IltEventsListStateModel {
  activeTab: number;
}

@State<IltEventsListStateModel>({
  name: 'iltEventsList',
  defaults: {
    activeTab: 0,
  },
  children: [ActiveIltEventsState, FinishedIltEventsState, DraftIltEventsState]
})
@Injectable()
export class IltEventsListState {

  @Selector([IltEventsListState])
  static activeTab(state: IltEventsListStateModel) {
    return state.activeTab;
  }

  @Action(ChangeILTEventsListTab)
  changeILTEventsListTab(
    { patchState, getState, dispatch }: StateContext<IltEventsListStateModel>,
    { payload: { activeTab } }: ChangeILTEventsListTab
  ) {
    patchState({ activeTab });
  }
}
