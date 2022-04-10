import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GetFullLanguageDictionary } from './containers/sp-courses-list/state/sp-courses-list.actions';
import { Store } from '@ngxs/store';

@Component({
  selector: 'leap-sp-courses-container',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpCoursesContainerComponent implements OnInit {

  constructor(private readonly store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetFullLanguageDictionary());
  }
}
