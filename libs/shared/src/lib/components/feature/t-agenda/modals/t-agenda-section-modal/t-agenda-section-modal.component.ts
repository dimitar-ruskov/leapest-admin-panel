import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { startWith } from 'rxjs/operators';
import * as moment from 'moment';
import {IKeyValuePair} from "../../../../../models";

@Component({
  selector: 'leap-t-agenda-section-modal',
  templateUrl: './t-agenda-section-modal.component.html',
  styleUrls: ['./t-agenda-section-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class TAgendaSectionModalComponent implements OnInit {
  @Input() type: string;
  @Input() name: string;
  @Input() description: string;
  @Input() durationHours: number;
  @Input() durationMins: number;
  @Input() day: string | null;
  @Input() agendaDays: { date: string; isEditable: boolean }[];
  @Input() editMode: boolean;
  @Input() dayEditable = true;
  @Input() isEvent = false;
  pureText = '';

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'], // toggled buttons
        [{ list: 'ordered' }, { list: 'bullet' }],
      ],
    },
  };

  charLimit = 1500;

  sectionForm: FormGroup;
  descriptionControl: FormControl;
  typeControl: FormControl;
  durationHoursControl: FormControl;
  durationMinsControl: FormControl;

  hoursDict: number[];
  hoursDictNZero = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  hoursDictWZero = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  minutesDict: number[];
  minutesDictNZero = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  minutesDictWZero = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  sectionTypeOptions = [
    {
      key: 'learning-topic',
      value: 'Learning Topic',
      subInfo: 'Any scheduled period of time for lecturing a given course topic.',
    },
    { key: 'break', value: 'Break', subInfo: 'Any scheduled breaks in a day, e.g., coffee-breaks or lunch.' },
  ];

  sectionDayControlOptions: IKeyValuePair[];

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.description?.indexOf('<p>') === -1) {
      this.description = '<p>' + this.description.split('\n').join('<p><br></p>') + '</p>';
    }
    this.pureText = new DOMParser().parseFromString(this.description || '', 'text/html').documentElement.textContent;
    this.sectionDayControlOptions = this.prepareDayOptions();

    this.sectionForm = this.fb.group({
      type: [this.type, Validators.required],
      name: [this.name, Validators.required],
      durationHours: [this.durationHours, Validators.required],
      durationMins: [this.durationMins || 0, Validators.required],
      description: [this.description, Validators.maxLength(1500)],
      day: [this.day ? this.day : this.agendaDays.length === 1 ? '0' : null, Validators.required],
    });
    this.descriptionControl = this.sectionForm.get('description') as FormControl;
    this.typeControl = this.sectionForm.get('type') as FormControl;
    this.durationHoursControl = this.sectionForm.get('durationHours') as FormControl;
    this.durationHoursControl.valueChanges
      .pipe(startWith(this.durationHoursControl.value), untilDestroyed(this))
      .subscribe((hours: number) => {
        if (hours === 0) {
          this.minutesDict = this.minutesDictWZero;
        } else {
          this.minutesDict = this.minutesDictNZero;
        }
      });
    this.durationMinsControl = this.sectionForm.get('durationMins') as FormControl;
    this.durationMinsControl.valueChanges
      .pipe(startWith(this.durationMinsControl.value), untilDestroyed(this))
      .subscribe((mins: number) => {
        if (mins === 0) {
          this.hoursDict = this.hoursDictWZero;
        } else {
          this.hoursDict = this.hoursDictNZero;
        }
      });
  }

  prepareDayOptions(): IKeyValuePair[] {
    const today = moment().format('YYYY-MM-DD');
    return this.agendaDays.map(
      (agendaDay: { date: string; isEditable: boolean }, idx: number): IKeyValuePair => {
        const agendaStartDate = moment(agendaDay.date).format('YYYY-MM-DD');

        return {
          key: idx.toString(),
          value: `Day ${idx + 1}`,
          isDisabled: this.isEvent ? moment(agendaStartDate).isSameOrBefore(today) : !agendaDay.isEditable,
        };
      },
    );
  }

  onContentChanged({ quill, html, text }) {
    this.descriptionControl.setValidators(Validators.maxLength(1500 + (html.length - text.length) + 1));
    this.pureText = text;
  }
}
