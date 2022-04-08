import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  TemplateRef,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  IRCreationStep,
  IRCreationSteps,
  IRCreationStepsList,
  IRTile,
} from '../../../../../../../../libs/shared/src/lib/models/interfaces/internal-repo/internal-repository-create-step.model';

@Component({
  selector: 'leap-internal-repository-create-modal',
  templateUrl: './internal-repository-create-modal.component.html',
  styleUrls: ['./internal-repository-create-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalRepositoryCreateModalComponent implements OnInit, AfterViewInit {
  @Input() data: any;
  @Output() closeModal = new EventEmitter<string>();

  @ViewChild('irTypeTemplate') irTypeTemplate: TemplateRef<ElementRef>;
  @ViewChild('irExternalTemplate') irExternalTemplate: TemplateRef<ElementRef>;
  @ViewChild('irHostedTemplate') irHostedTemplate: TemplateRef<ElementRef>;

  readonly steps = IRCreationSteps;
  readonly ids: IRCreationStep[] = IRCreationStepsList;
  readonly stepLabels = {
    [IRCreationSteps.TYPE]: 'type',
    [IRCreationSteps.HOSTED]: 'hosted',
    [IRCreationSteps.EXTERNAL]: 'Summary',
  };

  constructor(private readonly cdr: ChangeDetectorRef) {}

  public templates = {};
  public step: IRCreationStep;

  ngOnInit() {
    this.step = this.steps.TYPE;
  }

  ngAfterViewInit(): void {
    this.templates = {
      irTypeTemplate: this.irTypeTemplate,
      irExternalTemplate: this.irExternalTemplate,
      irHostedTemplate: this.irHostedTemplate,
    };
    this.cdr.detectChanges();
  }

  public back(): void {
    this.step = this.steps.TYPE;
  }

  public selectType(e: IRTile): void {
    this.step = e.step;
  }

  public cancel(): void {
    this.closeModal.emit();
  }

  public getStepIndex(step: IRCreationStep): number {
    return this.ids.findIndex((s) => s === step);
  }
}
