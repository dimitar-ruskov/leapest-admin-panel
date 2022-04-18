import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import {map} from "rxjs/operators";
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

import {
  PlaceholderModel,
  TemplateComposerMessageModel,
  TemplateComposerModel,
} from '../../../models/notifications/template-composer.model';
import {CustomValidators, DeferredResource} from "../../../utils/common";
import {FormUtilService} from "../../../services/common";
import {ComposerComponent, ComposerEmittedEventType} from "../silk-editor/models/silk-editor.model";
import {ActionCreator} from "../silk-editor/actions/action-creator";
import {NotificationModel} from "../../../models/notifications/notifications.model";
import {Action} from "../silk-editor/actions/actions";
import {AddLinkModalComponent} from "../../modals/add-link-modal/add-link-modal.component";
import {AddLinkTextModalComponent} from "../../modals/add-link-text-modal/add-link-text-modal.component";
import {TemplateComposerService} from "../../../services/notifications/template-composer.service";

@Component({
  selector: 'leap-template-composer',
  templateUrl: './template-composer.component.html',
  styleUrls: ['./template-composer.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class TemplateComposerComponent implements OnInit {
  @Input() details: NotificationModel;
  @Input() showCC: boolean;

  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() submit: EventEmitter<TemplateComposerModel> = new EventEmitter();
  @Output() previewClicked: EventEmitter<TemplateComposerModel> = new EventEmitter();

  silkActionDispatcher$ = new Subject<Action>();
  subjectActionDispatcher$ = new Subject<Action>();

  form: FormGroup;
  placeholderTooltips: Map<string, string>;
  targetComponent: ComposerComponent;
  ComposerComponent = ComposerComponent;

  constructor(
    private readonly fb: FormBuilder,
    private readonly formUtil: FormUtilService,
    private readonly chgRef: ChangeDetectorRef,
    private readonly messageService: NzMessageService,
    private readonly modalService: NzModalService,
    private readonly templateComposerService: TemplateComposerService
  ) {}

  public ngOnInit(): void {
    this.form = this.fb.group({
      subject: [
        this.details.subjectJSON || this.getTemplateComposerValue(this.details.subject),
        [Validators.required, CustomValidators.composerNoWhitespace, CustomValidators.composerMaxLength],
      ],
      message: [this.details.emailMarkup, [Validators.required, CustomValidators.composerNoWhitespace]],
      cc: [this.details.informReportingManager],
    });

    this.templateComposerService.getPlaceholderTooltips()
      .pipe(
        untilDestroyed(this),
        map((resource: DeferredResource<Map<string, string>>) => resource.response)
      ).subscribe((tooltips: Map<string, string>) => this.placeholderTooltips = tooltips)
  }

  addPlaceholder({ key, value, isLink }: PlaceholderModel) {
    if (this.targetComponent === ComposerComponent.MESSAGE) {
      this.silkActionDispatcher$.next(ActionCreator.addPlaceholder(key, value, isLink));
    } else if (this.targetComponent === ComposerComponent.SUBJECT) {
      this.subjectActionDispatcher$.next(ActionCreator.addPlaceholder(key, value, isLink));
    } else {
      this.showPlaceholderMissedError();
    }
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  public onSubmit(): void {
    this.formUtil.triggerValidation(this.form);

    if (this.form.valid) {
      const val: TemplateComposerModel = {
        cc: this.form.value.cc,
        message: JSON.parse(JSON.stringify(this.form.value.message)['replaceAll']('quote', 'paragraph')),
        subject: this.getStringifyValue(this.form.value.subject),
        subjectJSON: this.form.value.subject,
      };
      this.submit.emit(val);
    } else {
      this.chgRef.detectChanges();
    }
  }

  getTemplateComposerValue(string: string): TemplateComposerMessageModel[] {
    return [{ type: 'paragraph', children: [{ text: string }] }];
  }

  getStringifyValue(template: TemplateComposerMessageModel[]): string {
    return template.map((row) => row.children.map((chunk) => chunk.text ?? chunk.placeholder.value).join('')).join(' ');
  }

  changeTargetComponent(component: ComposerComponent): void {
    this.targetComponent = component;
  }

  public onOpenModal({ type, data }): void {
    switch (type) {
      case ComposerEmittedEventType.PREVIEW:
        this.onPreviewClicked();
        break;

      case ComposerEmittedEventType.PLACEHOLDER_MISSED:
        this.showPlaceholderMissedError();
        break;

      case ComposerEmittedEventType.LINK_URL:
        this.openAddLinkUrlModal();
        break;

      case ComposerEmittedEventType.LINK_TEXT:
        this.openAddLinkTextModal(data);
        break;
    }
  }

  private onPreviewClicked(): void {
    const val: TemplateComposerModel = {
      ...this.form.value,
      message: JSON.parse(JSON.stringify(this.form.value.message)['replaceAll']('quote', 'paragraph')),
    };
    this.previewClicked.next(val);
  }

  private showPlaceholderMissedError(): void {
    this.messageService.create('error', 'Please first select a position on which you like to insert the placeholder.');
  }

  private openAddLinkUrlModal(): void {
    const modal = this.modalService.create({
      nzTitle: 'Add Link',
      nzWidth: '660px',
      nzContent: AddLinkModalComponent,
      nzWrapClassName: 'modal-class',
      nzFooter: [
        {
          label: 'Close',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save',
          type: 'primary',
          disabled: (d) => !d.form.valid || d.form.pristine,
          onClick: (data) => {
            const formValue = data.form.getRawValue();
            if (formValue.link) {
              this.silkActionDispatcher$.next(ActionCreator.addLink(formValue.link));
            }
            modal.destroy();
          },
        },
      ],
    });
  }

  private openAddLinkTextModal(placeholder: PlaceholderModel): void {
    const modal = this.modalService.create({
      nzTitle: 'Add Link Text',
      nzWidth: '660px',
      nzContent: AddLinkTextModalComponent,
      nzWrapClassName: 'modal-class',
      nzFooter: [
        {
          label: 'Close',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save',
          type: 'primary',
          disabled: (d) => !d.form.valid || d.form.pristine,
          onClick: (data) => {
            const formValue = data.form.getRawValue();
            if (formValue.text) {
              if (this.targetComponent === ComposerComponent.MESSAGE) {
                this.silkActionDispatcher$.next(
                  ActionCreator.addPlaceholder(placeholder.key, placeholder.value, placeholder.isLink, formValue.text),
                );
              } else if (this.targetComponent === ComposerComponent.SUBJECT) {
                this.subjectActionDispatcher$.next(
                  ActionCreator.addPlaceholder(placeholder.key, placeholder.value, placeholder.isLink, formValue.text),
                );
              }
            }
            modal.destroy();
          },
        },
      ],
    });
  }
}
