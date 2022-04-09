import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';

import { PublishingState } from '../../../../state/publishing.state';
import {
  IPublishingSettings, IPublishingTab
} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces/publishing/publishing.model";


@Component({
  selector: 'leap-publishing-internal-repository',
  templateUrl: './publishing-internal-repository.component.html',
  styleUrls: ['./publishing-internal-repository.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class PublishingInternalRepositoryComponent {
  @Output() editSetting: EventEmitter<IPublishingSettings> = new EventEmitter<IPublishingSettings>();

  @Select(PublishingState.internalRepoTabs)
  internalRepoTabs$: Observable<IPublishingTab[]>;

  constructor() {}

  public editSettings(data: IPublishingSettings): void {
    this.editSetting.emit(data);
  }
}
