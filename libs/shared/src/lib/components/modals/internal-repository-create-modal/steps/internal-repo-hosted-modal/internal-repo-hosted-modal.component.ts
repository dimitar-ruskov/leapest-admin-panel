import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2
} from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Observable } from "rxjs";
import { filter, startWith, switchMap, take } from "rxjs/operators";
import { NzModalRef } from "ng-zorro-antd/modal";

import { ExamShortInfo, IKeyValuePair, InternalRepositoryDTO, IRContent } from "../../../../../models";
import { DeferredResource } from "../../../../../utils/common";
import {
  InternalRepositoryHandlerService
} from "../../../../../services/materials/internal-repo/internal-repository-handler.service";
import { UploadService } from "../../../../../services/common/upload.service";
import { EnvironmentService } from "../../../../../services/common/environment.service";
import { NotificationService } from "../../../../../services/common/notification.service";
import { InternalRepositoryService } from "../../../../../services/materials/internal-repo/internal-repository.service";
import { AdminCoursesService } from "../../../../../services/events/admin-courses.service";


@Component({
  selector: 'leap-internal-repo-hosted-modal',
  templateUrl: './internal-repo-hosted-modal.component.html',
  styleUrls: ['./internal-repo-hosted-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class InternalRepoHostedModalComponent implements OnInit {
  @Input() type: IKeyValuePair;
  @Input() name: string;
  @Input() language: string;
  @Input() examReferenceId: number;
  @Input() initExam: IRContent;
  @Input() sku: string;
  @Input() parentSKU: string;
  @Input() contentsArray: { bucket: string; key: string; order: number; name: string }[] = [];
  @Input() deliverableId: number;
  @Input() isVariant: boolean;

  @Output() back: EventEmitter<void> = new EventEmitter();
  @Output() onClose: EventEmitter<void> = new EventEmitter();

  @Select(state => state.core.iltMaterialTypes)
  iltMaterialTypes$: Observable<IKeyValuePair[]>;

  @Select(state => state.core.internalRepositoryLanguages)
  iltLanguageDictionary$: Observable<IKeyValuePair[]>;

  public form: FormGroup;
  public createBtnLoading = false;

  public allowUpload = true;
  public allowedUploadFormats: string;
  public allowedUploadFormatsMessage: string;
  public uploading = false;
  public maxFileSize = 100;
  public maxFilesCount = 10;
  public examList: ExamShortInfo[];
  public exam: IRContent;
  private languageDict: IKeyValuePair[];
  private selectedLangKey: string;
  private modal: NzModalRef;

  constructor(
    public readonly environment: EnvironmentService,
    private readonly store: Store,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly renderer: Renderer2,
    private readonly cdr: ChangeDetectorRef,
    private readonly uploadService: UploadService,
    private readonly irService: InternalRepositoryService,
    private readonly adminCoursesService: AdminCoursesService,
    private readonly notification: NotificationService,
    private readonly irHandlerService: InternalRepositoryHandlerService,
    private readonly internalRepositoryService: InternalRepositoryService,
  ) {}

  ngOnInit(): void {
    this.adminCoursesService
      .getInternalMaterialsExams()
      .pipe(untilDestroyed(this))
      .subscribe((res: DeferredResource<ExamShortInfo[]>) => {
        if (res.isSuccess) {
          this.examList = res.response;
          this.cdr.detectChanges();
        }
      });
    this.iltLanguageDictionary$.pipe(take(1)).subscribe((lan) => (this.languageDict = lan));

    this.form = this.fb.group({
      type: [this.type, [Validators.required]],
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
      exam: [this.examReferenceId],
      _contents: this.fb.array(this.contentsArray.map((c) => this.initItems(c, { name: c.name }))),
    });

    this.setRestrictions(this.type?.key);
    if (this.initExam) {
      this.exam = this.initExam;
    }

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

    this.form
      .get('type')
      .valueChanges.pipe(
        filter((t) => !!t),
        untilDestroyed(this),
      )
      .subscribe((type: IKeyValuePair) => {
        this.setRestrictions(type.key);
        this.contents.clear();
        this.form.get('name').patchValue('');
        this.form.get('languages').patchValue(null);
        this.form.get('exam').patchValue(null);
        this.exam = null;

        this.form.controls.name.setAsyncValidators(
          this.adminCoursesService.existingNameAsyncValidator({
            ignore: this.name,
            type: type.key,
            isVariant: this.isVariant,
          }),
        );
        this.form.controls.name.updateValueAndValidity();
      });

    this.form
      .get('exam')
      .valueChanges.pipe(
        filter((a) => !!a),
        switchMap((exam: number) => {
          return this.adminCoursesService.getInternalMaterialsExamDetails(exam);
        }),
        untilDestroyed(this),
      )
      .subscribe((res) => {
        if (res.isSuccess) {
          this.exam = res.response;
          // this.form.get('name').setValue(this.exam.displayName);
          this.form.get('name').patchValue('');
          this.form.get('languages').patchValue(res.response.language.configValue);
        }
      });
  }

  public saveContentName(element: any, content: any, index: number): void {
    this.renderer.setAttribute(element, 'disabled', 'disabled');
    const newContentName = element.value;
    if (newContentName.trim().length >= 6 && newContentName.trim().length <= 60) {
      content.name = element.value;
    }
    this.renderer.setValue(element, content.name);
    this.contents
      .at(index)
      .get('name')
      .patchValue(newContentName);
    this.form.markAsDirty();
  }

  public enableContentName(element: any): void {
    this.renderer.removeAttribute(element, 'disabled');
    element.focus();
  }

  public swapContent(index: number, moveUp = true): void {
    const contents = this.contents.value;
    const newContents = moveUp ? this.swap(contents, index - 1, index) : this.swap(contents, index, index + 1);
    this.contents.setValue(newContents);
    this.form.markAsDirty();
    this.cdr.detectChanges();
  }

  get contents(): FormArray {
    return this.form.get('_contents') as FormArray;
  }

  public initItems(initVal: any, file: any): FormGroup {
    return this.fb.group({
      bucket: [initVal?.bucket, Validators.required],
      key: [initVal?.key, Validators.required],
      order: [initVal?.order],
      name: file?.name,
    });
  }

  public removeContent(index: number): void {
    this.contents.removeAt(index);
    this.cdr.detectChanges();
  }

  public beforeUpload = (file: File) => {
    if (this.contents.length >= this.maxFilesCount) {
      // this.message.error(`You can only upload ${this.maxFilesCount}`);
      return false;
    }
    if (this.contents.value.find((item) => item.name === file.name)) {
      this.notification.error('This file already added');
      return false;
    }
    const parts = file.name.split('.');
    const ext = `.${parts[parts.length - 1]}`;
    let allowedFormat = true;
    if (this.allowedUploadFormats) {
      allowedFormat = this.allowedUploadFormats.split(',').includes(ext);
    }
    if (!allowedFormat) {
      this.notification.error(`File must be of type ${this.allowedUploadFormatsMessage}`);
    }
    const isLt2M = file.size / 1024 / 1024 < this.maxFileSize;
    if (!isLt2M) {
      this.notification.error(`File must be of size max ${this.maxFileSize} mb`);
    }

    return allowedFormat && isLt2M;
  };

  public uploadFile = (event: any) => {
    this.uploadService.upload(event.file, this.environment.s3Storage).subscribe(
      (resp) => {
        if (resp.type === 'started') {
          this.uploading = true;
          this.cdr.detectChanges();
        }
        if (resp.type === 'progress') {
          event.onProgress(resp.progress);
        } else if (resp.type === 'success') {
          event.onSuccess(event.data);
          this.uploading = false;
          this.addContent(resp, event.file);
        }
      },
      (error) => {
        event.onError(error);
        this.uploading = false;
      },
      () => {
        this.cdr.detectChanges();
      },
    );
  };

  private swap(arr: any[], index1: number, index2: number): any[] {
    arr = [...arr];
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
    return arr;
  }

  private addContent(initVal: any, file: any): void {
    this.contents.push(this.initItems(initVal, file));
    this.cdr.detectChanges();
  }

  private setRestrictions(type: string): void {
    const typeToCheck = ['courseBook', 'video', 'eLearning', 'presentation'];
    if (typeToCheck.filter((types) => types == type).length != 0) {
      this.internalRepositoryService
        .getDeliverableRequirements(type)
        .pipe(untilDestroyed(this))
        .subscribe((res: DeferredResource<any>) => {
          if (res.isSuccess) {
            this.allowUpload = true;
            const allowedFormat = res.response.supportedInputTypes.map((val) => `.${val.toLowerCase()}`);
            this.allowedUploadFormatsMessage = allowedFormat.join(', ');
            this.allowedUploadFormats = allowedFormat.join(',');
            this.maxFilesCount = res.response.maxItemsPerDeliverable || 10;
            this.maxFileSize = res.response.maxFileSizeMb;
            this.cdr.detectChanges();
          }
        });
    } else {
      this.allowUpload = false;
    }
  }

  public goBack(): void {
    this.type ? this.onClose.emit() : this.back.emit();
  }

  public onCreateRepository(): void {
    const formValue = this.form.getRawValue();
    this.createBtnLoading = true;
    this.irService
      .saveInternalRepository(formValue, this.exam, this.selectedLangKey, this.parentSKU, this.sku, this.deliverableId)
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
