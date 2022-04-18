import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { first, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import {
  IltEventLearnersUnenrolledState
} from "./ilt-event-learners-unenrolled/state/ilt-event-learners-unenrolled.state";
import {
  GetUnenrolledILTEventLearners
} from "./ilt-event-learners-unenrolled/state/ilt-event-learners-unenrolled.actions";

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

  isShowUnenrolled: Observable<boolean>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch([new GetUnenrolledILTEventLearners({ classEventId: this.classEventId })]);
    this.isShowUnenrolled = this.total$.pipe(
      filter((item) => !!item),
      map((item) => !!item),
      first(),
    );
  }
}
