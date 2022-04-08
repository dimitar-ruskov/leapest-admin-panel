import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { startWith, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { InternalRepositoryService } from '../../../../service/internal-repository.service';
import { InternalRepositoryHandlerService } from '../../../../service/internal-repository-handler.service';

import {
  IKeyValuePair,
  InternalRepositoryDTO
} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {IGlobalStateModel} from "../../../../../../state/global-state.model";
import {
  EnvironmentService,
  NotificationService
} from "../../../../../../../../../../libs/shared/src/lib/utils/services/common";
import {AdminCoursesService} from "../../../../../../../../../../libs/shared/src/lib/utils/services";

export const URL_REGEX = '^(http[s]?:\\/\\/)([0-9A-Za-z-\\._]+)+((\\.[a-zA-Z]{2,15})+)(\\/(.)*)?$';

@Component({
  selector: 'leap-internal-repo-external-modal',
  templateUrl: './internal-repo-external-modal.component.html',
  styleUrls: ['./internal-repo-external-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class InternalRepoExternalModalComponent implements OnInit {
  @Input() type: IKeyValuePair;
  @Input() path: string;
  @Input() name: string;
  @Input() language: string;
  @Input() sku: string;
  @Input() parentSKU: string;
  @Input() deliverableId: number;
  @Input() itemId: number;
  @Input() isVariant: boolean;

  @Output() back: EventEmitter<void> = new EventEmitter();
  @Output() onClose: EventEmitter<void> = new EventEmitter();

  @Select((state: IGlobalStateModel) => state.core.iltMaterialExternalTypes)
  iltMaterialExternalTypes$: Observable<IKeyValuePair[]>;

  @Select((state: IGlobalStateModel) => state.core.internalRepositoryLanguages)
  iltLanguageDictionary$: Observable<IKeyValuePair[]>;

  public form: FormGroup;
  private modal: NzModalRef;
  public createBtnLoading = false;
  public languageDict: IKeyValuePair[];
  public selectedLangKey: string;
  private readonly urlRegex = URL_REGEX;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly router: Router,
    private readonly notification: NotificationService,
    public readonly environment: EnvironmentService,
    private readonly irService: InternalRepositoryService,
    private readonly irHandlerService: InternalRepositoryHandlerService,
    private readonly adminCoursesService: AdminCoursesService,
  ) {}

  ngOnInit(): void {
    const type = {
      key: 'externalLink',
      value: 'External Link',
    };

    this.iltLanguageDictionary$.pipe(take(1)).subscribe((lan) => (this.languageDict = lan));

    this.form = this.fb.group({
      type: [type, [Validators.required]],
      name: [
        this.name,
        [Validators.required, Validators.minLength(6), Validators.maxLength(80)],
        [
          this.adminCoursesService.existingNameAsyncValidator({
            ignore: this.name,
            type: this.type && this.type.value ? this.type.value : '',
            isVariant: this.isVariant,
          }),
        ],
      ],
      languages: [this.language, Validators.required],
      externalLink: [this.path, [Validators.required, Validators.pattern(this.urlRegex)]],
      externalLinkType: [this.type, Validators.required],
    });

    this.form
      .get('languages')
      .valueChanges.pipe(startWith(this.language), untilDestroyed(this))
      .subscribe((val) => {
        if (val) {
          this.selectedLangKey = this.languageDict.find((l) => l.value === val)?.key;
        } else {
          this.selectedLangKey = null;
        }
      });
  }

  public goBack(): void {
    this.type ? this.onClose.emit() : this.back.emit();
  }

  public onCreateRepository(): void {
    const formValue = this.form.getRawValue();
    this.createBtnLoading = true;
    this.irService
      .saveInternalRepository(
        formValue,
        null,
        this.selectedLangKey,
        this.parentSKU,
        this.sku,
        this.deliverableId,
        this.itemId,
      )
      .toPromise()
      .then((res) => {
        if (res?.response) {
          this.openLoader(res?.response);
        }
      });
  }

  private openLoader(res: InternalRepositoryDTO): void {
    this.createBtnLoading = false;
    this.onClose.emit();

    this.modal = this.irHandlerService.waitModal(res);
  }
}
