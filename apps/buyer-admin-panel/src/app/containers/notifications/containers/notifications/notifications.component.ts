import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { NotificationsState } from '../../state/notifications.state';
import { ChangeNotificationsTab } from '../../state/notifications.actions';

@Component({
  selector: 'leap-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnDestroy {
  @Select(NotificationsState.activeTab)
  activeTab$: Observable<number>;

  constructor(private readonly store: Store) {}

  ngOnDestroy(): void {
    this.store.dispatch(new ChangeNotificationsTab({ activeTab: 0 }));
  }

  onSelectTab(activeTab: number): void {
    this.store.dispatch(new ChangeNotificationsTab({ activeTab }));
  }
}
