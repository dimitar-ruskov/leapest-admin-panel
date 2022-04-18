import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import {GeneralInfoField, ILTEvent} from "../../../../models";
import {getFullAddress} from "../../../../utils/common";

@Component({
  selector: 'leap-scheduling-details',
  templateUrl: './scheduling-details.component.html',
  styleUrls: ['./scheduling-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulingDetailsComponent {
  fields: GeneralInfoField[];

  @Input() iltEvent: ILTEvent;
  @Input() readonly: boolean;
  @Output() editProp = new EventEmitter<{ fieldId: string }>();

  get eventAddress(): string {
    return getFullAddress(this.iltEvent.classEvent?.venue);
  }

  constructor() {}

  public onEdit(fieldId: string): void {
    this.editProp.emit({ fieldId });
  }
}
