import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { combineLatest, filter, map } from 'rxjs';

import { PublishingService } from '../../../../../../../libs/shared/src/lib/services/publishing/publishing.service';
import { EditTabValue, GetIRSettings, GetGeneralSettings } from './publishing.actions';

import {IKeyValuePair} from "../../../../../../../libs/shared/src/lib/models";
import {DeferredResource} from "../../../../../../../libs/shared/src/lib/utils/common";
import {
  IPublishingSettings, IPublishingTab
} from "../../../../../../../libs/shared/src/lib/models/publishing/publishing.model";

export class PublishingStateModel {
  internalRepoTabs: IPublishingTab[];
  generalSettings: IPublishingSettings;
}

@State<PublishingStateModel>({
  name: 'publishing',
  defaults: {
    internalRepoTabs: [],
    generalSettings: null,
  },
})
@Injectable()
export class PublishingState {
  @Selector([PublishingState])
  static internalRepoTabs(state: PublishingStateModel) {
    return state.internalRepoTabs;
  }

  @Selector([PublishingState])
  static generalSettings(state: PublishingStateModel) {
    return state.generalSettings;
  }

  constructor(private readonly service: PublishingService) {}

  @Action(EditTabValue)
  editTabValue({ patchState, getState, dispatch }: StateContext<PublishingStateModel>, action: EditTabValue) {
    const { updatedTab } = action.payload;
    const { internalRepoTabs } = getState();

    return this.service.editPublishingSettings(updatedTab).pipe(
      tap((resource: DeferredResource<IPublishingSettings>) => {
        if (resource.isSuccess) {
          if (updatedTab.internalRepositorySettingType.configKey === 'globalSettings') {
            patchState({ generalSettings: resource.response });
            return;
          }
          const updatedTabs = internalRepoTabs.map((tab) =>
            tab.key === updatedTab.internalRepositorySettingType.configKey ? { ...tab, value: resource.response } : tab,
          );

          patchState({ internalRepoTabs: updatedTabs });
        }
      }),
    );
  }

  @Action(GetIRSettings)
  getIRSettings({ patchState, getState }: StateContext<PublishingStateModel>, { payload }: GetIRSettings) {
    const types = payload.irTypes;
    if (types) {
      const $calls = types.map((type: IKeyValuePair) => {
        return this.service.getDetails(type.key).pipe(
          filter((_) => !_.pending),
          map((res) => ({
            key: type.key,
            value: res.response,
            text: type.value,
          })),
        );
      });
      return combineLatest($calls).pipe(tap((tabs: IPublishingTab[]) => patchState({ internalRepoTabs: tabs })));
    }
  }

  @Action(GetGeneralSettings)
  getGeneralSettings({ patchState }: StateContext<PublishingStateModel>) {
    const type = 'globalSettings';
    return this.service.getDetails(type).pipe(
      tap((resource: DeferredResource<IPublishingSettings>) => {
        if (resource.isSuccess) {
          patchState({ generalSettings: resource.response });
        }
      }),
    );
  }
}
