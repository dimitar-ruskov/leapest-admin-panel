import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { take } from 'rxjs/operators';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import produce from 'immer';

import { EditAgendaDateTimeModalComponent } from './modals/edit-agenda-date-time-modal/edit-agenda-date-time-modal.component';
import { TAgendaSectionModalComponent } from './modals/t-agenda-section-modal/t-agenda-section-modal.component';
import {
  IKeyValuePair,
  ILTCourseAgenda,
  ILTCourseAgendaDay,
  ILTCourseAgendaDaySection
} from "../../../models";
import {EnvironmentService} from "../../../services/common";
import {TimezoneService} from "../../../services/common/timezone.service";
import {formatDate} from "../../../utils/common";

const WARNING_MODAL_MESSAGE =
  'Warning: Changing the agenda will send updated calendar invitations to enrolled learners, course instructor and the training manager';
const EDIT_DATE_TIME_MODAL_TITLE = 'Edit Date & Time';

export type ButtonState = 'loading' | 'active' | 'disabled';

@Component({
  selector: 'leap-t-agenda',
  templateUrl: './t-agenda.component.html',
  styleUrls: ['./t-agenda.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TAgendaComponent implements OnInit, OnChanges {
  warningModalMessage = WARNING_MODAL_MESSAGE;
  @ViewChild('warningModalContent') warningModalContent: TemplateRef<HTMLParagraphElement>;

  @Input() agenda: ILTCourseAgenda;
  @Input() isEditable = false;
  @Input() isEvent = false;
  @Input() isDateTimeEditable = false;
  @Input() borderless = false;
  @Input() isHistorical = false;
  @Input() openDateTimeModalAuto = false;
  @Input() showSaveChanges: ButtonState;
  @Input() timezones: IKeyValuePair[];
  @Input() timezone: string;
  @Input() isTimezoneEditable = false;
  @Input() isCreating = false;

  @Output() valueChange: EventEmitter<{
    valid: boolean;
    changed: boolean;
    value: ILTCourseAgenda;
    timezone: string;
  }> = new EventEmitter();

  @Output() saveChanges: EventEmitter<void> = new EventEmitter();

  templateAgenda: ILTCourseAgenda;
  templateTimezone: string;
  dateTimeSelectForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    public environmentService: EnvironmentService,
    private readonly modalService: NzModalService,
    private readonly timezoneService: TimezoneService,
  ) {}

  ngOnInit(): void {
    this.initTemplateAgenda(this.agenda);
    this.templateTimezone = this.timezone || this.timezoneService.getBrowserTimezone();
    this.emitAgendaValueAndValidity(false);
    if (this.openDateTimeModalAuto) {
      setTimeout(() => {
        this.openDateTimeModal(null);
      }, 200);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes.agenda && !changes.agenda.isFirstChange()) {
        this.initTemplateAgenda(changes.agenda.currentValue);
        this.emitAgendaValueAndValidity(false);
      }
      if (changes.timezone && !changes.timezone.isFirstChange()) {
        this.templateTimezone = this.timezone;
        this.emitAgendaValueAndValidity(false);
      }
    }
  }

  private initTemplateAgenda(originalCourseAgenda: ILTCourseAgenda): void {
    this.templateAgenda = produce(originalCourseAgenda, (agenda: ILTCourseAgenda) => {
      if (!originalCourseAgenda?.days?.length) {
        agenda.days = [
          {
            startDateTime: null,
            endDateTime: null,
            items: [],
            isEditable: true,
          },
        ];
      } else {
        agenda.days = agenda.days.map((el) =>
          Object.assign({}, el, {
            isEditable: this.isEditable,
          }),
        );
      }

      return agenda;
    });
  }

  addDay(): void {
    this.templateAgenda = produce(this.templateAgenda, (a: ILTCourseAgenda) => {
      a.days.push({ startDateTime: '', endDateTime: '', items: [], isEditable: true });
    });

    this.emitAgendaValueAndValidity();
  }

  addSection(day?: ILTCourseAgendaDay, dayIdx?: number, sectionIndex?: number): void {
    const modal = this.modalService.create({
      nzTitle: 'Add New Section?',
      nzWidth: '660px',
      nzContent: TAgendaSectionModalComponent,
      nzWrapClassName: 'modal-class',
      nzComponentParams: {
        agendaDays: this.templateAgenda.days.map((agendaDay: ILTCourseAgendaDay) => ({
          date: agendaDay.startDateTime,
          isEditable: agendaDay.isEditable,
        })),
        day: day !== undefined ? dayIdx.toString() : null,
        isEvent: this.isEvent,
      },
      nzFooter: [
        {
          label: 'Cancel',
          type: 'text',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Add Section',
          type: 'primary',
          disabled: (d) => !d.sectionForm.valid,
          onClick: (data) => {
            modal.destroy();
            const formValue = data.sectionForm.getRawValue();
            if (sectionIndex !== undefined) {
              this.saveSection(formValue, 'day-break', sectionIndex + 1);
            } else {
              this.saveSection(formValue, 'new');
            }
          },
        },
      ],
    });
  }

  get isDisabledAddSection(): boolean {
    return this.templateAgenda.days.every((day) => !day.isEditable);
  }

  saveSection(formValue, saveType: string, index?: number): void {
    this.templateAgenda = produce(this.templateAgenda, (a: ILTCourseAgenda) => {
      if (saveType === 'day-break') {
        a.days[formValue.day].items.splice(index, 0, {
          type: { configKey: formValue.type },
          title: formValue.name,
          duration: formValue.durationHours * 60 + parseInt(formValue.durationMins, 10),
          description: formValue.description,
        });
      } else if (saveType === 'edit') {
        a.days[formValue.day].items[index] = {
          type: { configKey: formValue.type },
          title: formValue.name,
          duration: formValue.durationHours * 60 + parseInt(formValue.durationMins, 10),
          description: formValue.description,
          id: a.days[formValue.day].items[index].id,
        };
      } else {
        a.days[formValue.day].items.push({
          type: { configKey: formValue.type },
          title: formValue.name,
          duration: formValue.durationHours * 60 + parseInt(formValue.durationMins, 10),
          description: formValue.description,
        });
      }
    });
    this.emitAgendaValueAndValidity();
  }

  editSection(dayIndex: number, sectionIndex: number, dayEditable = true): void {
    const type = this.templateAgenda.days[dayIndex].items[sectionIndex].type.configKey;
    const name = this.templateAgenda.days[dayIndex].items[sectionIndex].title;
    const durationHours = (this.templateAgenda.days[dayIndex].items[sectionIndex].duration / 60) | 0;
    const durationMins = this.templateAgenda.days[dayIndex].items[sectionIndex].duration % 60;
    const description = this.templateAgenda.days[dayIndex].items[sectionIndex].description;
    const day = dayIndex.toString();

    const modal = this.modalService.create({
      nzTitle: 'Edit Section',
      nzWidth: '660px',
      nzContent: TAgendaSectionModalComponent,
      nzWrapClassName: 'modal-class',
      nzComponentParams: {
        editMode: true,
        agendaDays: this.templateAgenda.days.map((agendaDay: ILTCourseAgendaDay) => ({
          date: agendaDay.startDateTime,
          isEditable: agendaDay.isEditable,
          isEvent: this.isEvent,
        })),
        dayEditable,
        day,
        type,
        name,
        durationHours,
        durationMins,
        description,
      },
      nzFooter: [
        {
          label: 'Cancel',
          type: 'text',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => !d.sectionForm.valid || d.sectionForm.pristine,
          onClick: (data) => {
            modal.destroy();
            const formValue = data.sectionForm.getRawValue();
            this.saveSection(formValue, 'edit', sectionIndex);
          },
        },
      ],
    });
  }

  removeSection(dayIndex: number, sectionIndex: number): void {
    this.templateAgenda = produce(this.templateAgenda, (a: ILTCourseAgenda) => {
      a.days[dayIndex].items.splice(sectionIndex, 1);
    });
    this.emitAgendaValueAndValidity();
  }

  calculateDuration(d: number): string {
    const hour = (d / 60) | 0;
    const min = d % 60;

    return hour.toString() + ' h ' + min.toString() + ' mins';
  }

  emitAgendaValueAndValidity(changed = true): void {
    this.valueChange.emit({
      valid: this.checkAgendaValidity(),
      changed,
      value: this.templateAgenda,
      timezone: this.templateTimezone,
    });
  }

  checkAgendaValidity(): boolean {
    const days = this.templateAgenda.days;

    for (const day of days) {
      if (!day.items.length || (this.isEvent && !day.startDateTime)) {
        return false;
      }
    }

    return !!this.templateAgenda.days.length;
  }

  addDayBreak(dayIndex: number, sectionIndex: number): void {
    const newDaysSections: ILTCourseAgendaDaySection[] = this.templateAgenda.days[dayIndex].items.slice(
      sectionIndex + 1,
    );
    const oldDaysSections: ILTCourseAgendaDaySection[] = this.templateAgenda.days[dayIndex].items.slice(
      0,
      sectionIndex + 1,
    );
    const newDayIndex = dayIndex + 1;

    this.templateAgenda = produce(this.templateAgenda, (a: ILTCourseAgenda) => {
      a.days[dayIndex].items = oldDaysSections;
      a.days.splice(newDayIndex, 0, { startDateTime: '', endDateTime: '', items: newDaysSections });

      const lastIndex = a.days.length - 1;

      if (newDayIndex < lastIndex) {
        for (let i = newDayIndex + 1; i <= lastIndex; i++) {
          a.days[i].startDateTime = '';
          a.days[i].endDateTime = '';
        }
      }
    });

    this.emitAgendaValueAndValidity();
  }

  addDayBreakSection(day: ILTCourseAgendaDay, sectionIndex: number): void {
    this.addSection(day, sectionIndex);
  }

  moveSectionUp(dayIndex: number, sectionIndex: number): void {
    this.moveSection(dayIndex, sectionIndex, -1);
  }

  moveSectionDown(dayIndex: number, sectionIndex: number): void {
    this.moveSection(dayIndex, sectionIndex, 1);
  }

  deleteDay(i: number): void {
    this.templateAgenda = produce(this.templateAgenda, (a: ILTCourseAgenda) => {
      a.days.splice(i, 1);
    });

    this.emitAgendaValueAndValidity();
  }

  calculateDayDurationAndItemCount(i: number): string {
    let d = 0;
    const items = this.templateAgenda.days[i].items;

    items.forEach((item) => (d = d + item.duration));

    if (!d) {
      return '';
    } else {
      return items.length.toString() + ' item' + (items.length > 1 ? 's, ' : ', ') + this.calculateDuration(d);
    }
  }

  editDateTime(): void {
    this.openDateTimeModal(null);
  }

  selectDateTime(i: number, e): void {
    e.preventDefault();
    e.stopPropagation();
    this.openDateTimeModal(i);
  }

  private openDateTimeModal(selectedDayIndex: number | null): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: EDIT_DATE_TIME_MODAL_TITLE,
      nzContent: EditAgendaDateTimeModalComponent,
      nzComponentParams: {
        dayIndex: selectedDayIndex,
        agendaDays: this.templateAgenda.days,
        isHistorical: this.isHistorical,
        timezones: this.timezones,
        timezone: this.templateTimezone,
        isTimezoneEditable: this.isTimezoneEditable,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzMaskClosable: false,
      nzFooter: null,
    });

    modal.afterClose
      .asObservable()
      .pipe(take(1))
      .subscribe((result: { days: { date: Date; time: Date }[]; timezone: string }) => {
        if (result) {
          this.saveBulkDateTimeSelection(result.days);
          this.templateTimezone = result.timezone;
          this.emitAgendaValueAndValidity();
        }
        modal.destroy();
      });
  }

  private saveBulkDateTimeSelection(days: { date: Date; time: Date }[]) {
    this.templateAgenda = produce(this.templateAgenda, (a: ILTCourseAgenda) => {
      for (let i = 0; i < days.length; i++) {
        const day = days[i];

        a.days[i].startDateTime = day.date ? formatDate(day.date, day.time) : null;
      }
    });
  }

  private moveSection(dayIndex: number, sectionIndex: number, modifier: -1 | 1): void {
    this.templateAgenda = produce(this.templateAgenda, (a: ILTCourseAgenda) => {
      [a.days[dayIndex].items[sectionIndex], a.days[dayIndex].items[sectionIndex + modifier]] = [
        a.days[dayIndex].items[sectionIndex + modifier],
        a.days[dayIndex].items[sectionIndex],
      ];
    });
    this.emitAgendaValueAndValidity();
  }

  onSaveChanges(): void {
    if (this.isEvent) {
      this.modalService.confirm({
        nzTitle: null,
        nzContent: this.warningModalContent,
        nzOnOk: () => this.saveChanges.emit(),
      });
    } else {
      this.saveChanges.emit();
    }
  }
}
