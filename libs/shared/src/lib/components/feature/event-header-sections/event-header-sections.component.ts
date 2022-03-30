import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ILTEvent } from '../../models/ilt-event.model';
import { SPCourseLanguageVariant } from '../../containers/self-paced-courses-container/models/self-paced-course.model';

const LEARNER_REGISTRATION_IN_PROGRESS_TOOLTIP =
  'Learner registration in progress. Please check back later for event enrollment update';

@Component({
  selector: 'leap-event-header-sections',
  templateUrl: './event-header-sections.component.html',
  styleUrls: ['./event-header-sections.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventHeaderSectionsComponent {
  learnerRegistrationInProgressTooltip = LEARNER_REGISTRATION_IN_PROGRESS_TOOLTIP;

  @Input() details: ILTEvent | SPCourseLanguageVariant;
  @Input() waitingListTotal: number;
  @Input() isIltEventEditable = true;

  @Output() assignUsersClicked = new EventEmitter<void>();
  @Output() onEditClicked = new EventEmitter<string>();

  constructor() {}

  get isWaitingListEnabled() {
    return this.details?.waitingQueueStatus?.configKey === 'enabled';
  }

  onAssignUsersClick() {
    this.assignUsersClicked.emit();
  }

  onEditPropClicked(prop: string) {
    this.onEditClicked.emit(prop);
  }
}