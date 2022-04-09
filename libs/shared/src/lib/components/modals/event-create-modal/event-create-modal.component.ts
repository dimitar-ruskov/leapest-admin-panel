import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {IKeyValuePair, TFormControlConfigOption} from "../../../models/interfaces";

@Component({
  selector: 'leap-event-create-modal',
  templateUrl: './event-create-modal.component.html',
  styleUrls: ['./event-create-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCreateModalComponent implements OnInit {
  @Input() courseOptionsForEvent?: IKeyValuePair[];
  @Input() selectedCourseName?: string;
  @Input() selectedCourseId?: string;

  eventTypeOptions: TFormControlConfigOption[] = [
    {
      key: true,
      value: 'Register Past Event',
      extra:
        'Use this to register an event that already happened before.  Note that no changes can be made after submition.',
      iconClass: 'fal fa-calendar-day',
    },
    {
      key: false,
      value: 'Schedule New Event',
      extra: 'Use this to schedule an upcoming event. Changes can be applied to the event until it is completed.',
      iconClass: 'fal fa-calendar-plus',
    },
  ];

  eventDeliveryOptions: TFormControlConfigOption[] = [
    {
      key: true,
      value: 'Virtual',
      extra: 'Delivered by an instructor through a web conferencing tool (Zoom).',
      iconClass: 'fal fa-user-headset',
    },
    {
      key: false,
      value: 'Classroom',
      extra: 'Delivered by an instructor in a classroom at a specified venue.',
      iconClass: 'fal fa-chalkboard-teacher',
    },
  ];

  eventCreationForm: FormGroup;
  eventCreationFormHistoricalControl: FormControl;
  eventCreationFormVirtualControl: FormControl;
  eventCreationFormCourseIdControl: FormControl;
  createBtnLoading = false;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.eventCreationForm = this.fb.group({
      historical: [null, Validators.required],
      virtual: [null, Validators.required],
      courseId: [this.selectedCourseId, Validators.required],
    });
    this.eventCreationFormHistoricalControl = this.eventCreationForm.get('historical') as FormControl;
    this.eventCreationFormVirtualControl = this.eventCreationForm.get('virtual') as FormControl;
  }
}
