import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ILTEventLearner } from '../../../models/ilt-event.model';

@Component({
  selector: 'leap-remove-waiting-list-modal',
  templateUrl: './remove-waiting-list-modal.component.html',
  styleUrls: ['./remove-waiting-list-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveWaitingListModalComponent implements OnInit {
  @Input() learner: ILTEventLearner;

  constructor() {}

  ngOnInit(): void {}
}
