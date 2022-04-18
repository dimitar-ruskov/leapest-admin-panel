import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {ILTEventLearner} from "../../../../models";

const NO_DATA_PLACEHOLDER_TEXT = 'N/A';

@Component({
  selector: 'leap-attendance-tracking-user-entry',
  templateUrl: './attendance-tracking-user-entry.component.html',
  styleUrls: ['./attendance-tracking-user-entry.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceTrackingUserEntryComponent {
  displayName: string;
  email: string;

  @Input() set user(user: ILTEventLearner) {
    if (user) {
      const { firstName, lastName, username } = user;

      this.displayName = firstName && lastName ? `${firstName} ${lastName}` : NO_DATA_PLACEHOLDER_TEXT;
      this.email = username;
    } else {
      this.displayName = NO_DATA_PLACEHOLDER_TEXT;
      this.email = NO_DATA_PLACEHOLDER_TEXT;
    }
  };
}
