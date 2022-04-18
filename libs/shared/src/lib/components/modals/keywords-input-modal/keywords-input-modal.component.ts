import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import {IKeyValuePair} from "../../../models";
import { AdminCoursesService } from "../../../services/events/admin-courses.service";

@Component({
  selector: 'leap-keywords-input-modal',
  templateUrl: './keywords-input-modal.component.html',
  styleUrls: ['./keywords-input-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeywordsInputModalComponent implements OnInit {
  @Input() keywords: string[];
  @Input() mainLabel: string;
  @Input() subLabel: string;
  @Input() initVal: any;
  keywordsControlOptions$: Observable<IKeyValuePair[]>;

  constructor(private readonly fb: FormBuilder, private readonly service: AdminCoursesService) {}

  form: FormGroup;
  keywordsControl: FormControl;

  ngOnInit(): void {
    this.form = this.fb.group({
      keywords: [this.keywords],
    });
    this.keywordsControl = this.form.get('keywords') as FormControl;
  }

  onInputKeyword(search: string): void {
    if (search) {
      this.keywordsControlOptions$ = this.service.getAgoraKeywords(search).pipe(map((t) => t.data));
    }
  }

  onRemoveKeyword(key: string) {
    const k_value = [...this.keywordsControl.value];
    const k_index = k_value.findIndex((k) => k === key);
    k_value.splice(k_index, 1);
    this.keywordsControl.patchValue(k_value);
  }
}
