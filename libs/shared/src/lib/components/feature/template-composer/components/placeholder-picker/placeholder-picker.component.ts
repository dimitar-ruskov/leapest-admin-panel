import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { PlaceholderModel } from '../../../../../models/interfaces/notifications/template-composer.model';
import {Configuration} from "../../../../../models/interfaces";

@Component({
  selector: 'leap-placeholder-picker',
  templateUrl: './placeholder-picker.component.html',
  styleUrls: ['./placeholder-picker.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceholderPickerComponent implements OnInit {
  @Input() placeholders: Configuration[];
  @Input() placeholderTooltips: Map<string, string>;

  @Output() selectPlaceholder: EventEmitter<PlaceholderModel> = new EventEmitter();

  form: FormGroup;
  filteredPlaceholders$: Observable<Configuration[]>;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      filter: [null],
    });
    this.filteredPlaceholders$ = this.form.get('filter').valueChanges.pipe(
      debounceTime(300),
      map((filter) => this.placeholders.filter((_) => _.configValue.toLowerCase().indexOf(filter.toLowerCase()) >= 0)),
      startWith(this.placeholders),
    );
  }
}
