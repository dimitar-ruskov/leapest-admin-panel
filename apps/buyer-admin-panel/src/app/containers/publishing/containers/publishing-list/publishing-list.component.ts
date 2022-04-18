import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { PublishingState } from '../../state/publishing.state';
import { EditTabValue, GetIRSettings, GetGeneralSettings } from '../../state/publishing.actions';
import {IGlobalStateModel} from "../../../../state/state.model";

import {IKeyValuePair} from "../../../../../../../../libs/shared/src/lib/models";
import {
  IPublishingSettings
} from "../../../../../../../../libs/shared/src/lib/models/publishing/publishing.model";

@Component({
  selector: 'leap-publishing-list',
  templateUrl: './publishing-list.component.html',
  styleUrls: ['./publishing-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class PublishingListComponent implements OnInit {
  @Select((state: IGlobalStateModel) => state.core.internalRepositoryTypes)
  irPublishingTypes$: Observable<IKeyValuePair[]>;

  @Select(PublishingState.generalSettings)
  generalSettings$: Observable<IPublishingSettings>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetGeneralSettings());

    this.irPublishingTypes$.pipe(untilDestroyed(this)).subscribe((irTypes) => {
      this.store.dispatch(new GetIRSettings({ irTypes }));
    });
  }

  public editSettings(data: IPublishingSettings): void {
    this.store.dispatch([new EditTabValue({ updatedTab: data })]);
  }
}
