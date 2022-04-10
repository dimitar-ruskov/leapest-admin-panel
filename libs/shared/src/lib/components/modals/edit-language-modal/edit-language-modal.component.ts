import { Component, ChangeDetectionStrategy, Input, TrackByFunction, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import {IKeyValuePair} from "../../../models/interfaces";
import {AdminCoursesService} from "../../../utils/services";

@Component({
  selector: 'leap-edit-language-modal',
  templateUrl: './edit-language-modal.component.html',
  styleUrls: ['./edit-language-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditLanguageModalComponent implements OnInit {

  pendingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  get pending$(): Observable<boolean> {
    return this.pendingSubject.asObservable();
  }

  iltLanguageDictionarySubject = new BehaviorSubject<IKeyValuePair[]>([]);

  get iltLanguageDictionary$(): Observable<IKeyValuePair[]> {
    return this.iltLanguageDictionarySubject.asObservable();
  }

  form: FormGroup = this.fb.group({
    language: [null, Validators.required]
  });

  get languageControl(): FormControl {
    return this.form.get('language') as FormControl;
  }

  @Input() language: string;

  trackByFn: TrackByFunction<IKeyValuePair> = (index, item) => item.key;

  constructor(private readonly fb: FormBuilder,
    private readonly adminCoursesService: AdminCoursesService) {

  }

  ngOnInit(): void {
    this.getDeliveryLanguages();
    this.form.patchValue({
      language: this.language
    });
  }

  private getDeliveryLanguages(): void {
    this.adminCoursesService.getDeliveryLanguages().pipe(
      take(1)
    ).subscribe((deliveryLanguages) => {
      this.pendingSubject.next(false);
      this.iltLanguageDictionarySubject.next(deliveryLanguages);
    }, () => this.pendingSubject.next(false));
  }
}
