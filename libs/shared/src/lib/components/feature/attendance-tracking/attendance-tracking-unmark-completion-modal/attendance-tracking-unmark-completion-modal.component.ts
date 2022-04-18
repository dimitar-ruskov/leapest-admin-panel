import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {ILTEventLearner} from "../../../../models";

@Component({
  selector: 'leap-attendance-tracking-unmark-completion-modal',
  templateUrl: './attendance-tracking-unmark-completion-modal.component.html',
  styleUrls: ['./attendance-tracking-unmark-completion-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceTrackingUnmarkCompletionModalComponent {
  @Input() user: ILTEventLearner;
}
