import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { catchError, filter, finalize } from "rxjs/operators";
import { of } from "rxjs";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { GoToEventCreationStep, UpdateILTEventDetails } from "../../state/ilt-events-create.actions";

import {
  ILTEvent,
  ILTEventCreationStep,
  InternalRepositoryDTO
} from "../../../../../../../../../../libs/shared/src/lib/models";
import {
  NotificationService
} from "../../../../../../../../../../libs/shared/src/lib/services/common/notification.service";

@Component({
  selector: 'leap-ilt-event-create-summary-step',
  templateUrl: './ilt-event-create-summary-step.component.html',
  styleUrls: ['./ilt-event-create-summary-step.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltEventCreateSummaryStepComponent implements OnInit {
  @Input() iltEvent: ILTEvent;

  submitting = false;

  learnerMaterialDTOs: InternalRepositoryDTO[] = [];
  instructorMaterialDTOs: InternalRepositoryDTO[] = [];

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly notification: NotificationService,
  ) {}

  ngOnInit(): void {
    const {
      masterInternalRepositories,
      additionalMasterInternalRepositories,
      marketplaceMaterials,
    } = this.iltEvent.course;
    const repositories = [
      ...masterInternalRepositories,
      ...additionalMasterInternalRepositories,
      ...marketplaceMaterials,
    ];
    this.instructorMaterialDTOs = repositories
      .filter((m) => m.userType.configKey === 'instructor')
      .map((m) => m.defaultVariant);

    this.learnerMaterialDTOs = repositories
      .filter((m) => m.userType.configKey === 'learner')
      .map((m) => m.defaultVariant);
  }

  onBack() {
    this.store.dispatch(new GoToEventCreationStep(ILTEventCreationStep.SCHEDULING));
  }

  onSubmit() {
    this.submitting = true;
    this.store
      .dispatch([new UpdateILTEventDetails(this.iltEvent, 'summary')])
      .pipe(
        catchError((error) => {
          this.notification.error(error?.message);
          return of(null);
        }),
        finalize(() => {
          this.submitting = false;
          this.cdr.detectChanges();
        }),
        filter((res) => !!res),
        untilDestroyed(this),
      )
      .subscribe(
        (_) => {
          this.submitting = false;
          this.router.navigate(['admin', 'ilt-events', 'details', this.iltEvent.sku]);
        },
        () => (this.submitting = false),
      );
  }
}
