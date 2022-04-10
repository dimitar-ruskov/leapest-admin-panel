import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { GetUnenrolledILTEventLearners } from './ilt-event-learners-unenrolled/state/ilt-event-learners-unenrolled.actions';
import { Select, Store } from '@ngxs/store';
import { IltEventLearnersUnenrolledState } from './ilt-event-learners-unenrolled/state/ilt-event-learners-unenrolled.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'leap-ilt-event-learners',
  templateUrl: './ilt-event-learners.component.html',
  styleUrls: ['./ilt-event-learners.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IltEventLearnersComponent implements OnInit {
  @Input() showEnrollmentRequests: boolean;
  @Input() classEventId: string;
  @Input() eventId: string;

  @Select(IltEventLearnersUnenrolledState.total)
  total$: Observable<number>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch([new GetUnenrolledILTEventLearners({ classEventId: this.classEventId })]);
  }
}
