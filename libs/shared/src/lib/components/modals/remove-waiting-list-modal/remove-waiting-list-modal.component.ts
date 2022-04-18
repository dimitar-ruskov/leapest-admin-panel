import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {ILTEventLearner} from "../../../models";

@Component({
  selector: 'leap-remove-waiting-list-modal',
  templateUrl: './remove-waiting-list-modal.component.html',
  styleUrls: ['./remove-waiting-list-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveWaitingListModalComponent {
  @Input() learner: ILTEventLearner;
}
