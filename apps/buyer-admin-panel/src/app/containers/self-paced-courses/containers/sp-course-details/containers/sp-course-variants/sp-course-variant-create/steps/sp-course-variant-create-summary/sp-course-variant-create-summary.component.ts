import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { catchError, filter, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';


import {
  GoToSPCourseLanguageVariantCreationStep,
  UpdatePreSPCourseLanguageVariant,
} from '../../state/sp-course-variant-create.actions';
import { SPCourseLanguageVariantCreationSteps } from '../../../../../../../../../../../../../libs/shared/src/lib/models/courses/sp-courses/sp-course-create-variant-step.model';
import {
  prepareGeneralInfoFields,
  prepareMaterialsFields,
  prepareVariantDetailsFields
} from "../../../../../../../../../../../../../libs/shared/src/lib/services/courses/sp-courses/sp-course-variants-handler.service";

import { PreSPCourseLanguageVariant } from '../../../../../../../../../../../../../libs/shared/src/lib/models/courses/sp-courses/sp-course-language-variant.model';
import {
  GeneralInfoField,
  MaterialsInfoField
} from "../../../../../../../../../../../../../libs/shared/src/lib/models";
import {NotificationService} from "../../../../../../../../../../../../../libs/shared/src/lib/services/common";


@Component({
  selector: 'leap-sp-course-variant-create-summary',
  templateUrl: './sp-course-variant-create-summary.component.html',
  styleUrls: ['./sp-course-variant-create-summary.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class SpCourseVariantCreateSummaryComponent implements OnInit, OnDestroy {
  submittingSubject = new BehaviorSubject<boolean>(false);

  get submitting$(): Observable<boolean> {
    return this.submittingSubject.asObservable();
  }

  generalInformationFields: GeneralInfoField[] = [];
  variantDetailsFields: GeneralInfoField[] = [];
  materialsFields: MaterialsInfoField[] = [];

  @Input() preSPCourseLanguageVariant: PreSPCourseLanguageVariant;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private readonly notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.generalInformationFields = prepareGeneralInfoFields(this.preSPCourseLanguageVariant.course);
    this.variantDetailsFields = prepareVariantDetailsFields(this.preSPCourseLanguageVariant);
    this.materialsFields = prepareMaterialsFields(this.preSPCourseLanguageVariant.course.masterInternalRepositories);
  }

  onBack(): void {
    this.store.dispatch(
      new GoToSPCourseLanguageVariantCreationStep({
        step: SPCourseLanguageVariantCreationSteps.DETAILS,
      }),
    );
  }

  onSubmit(): void {
    this.submittingSubject.next(true);
    this.store
      .dispatch([
        new UpdatePreSPCourseLanguageVariant({
          updatedPreSPCourseLanguageVariant: this.preSPCourseLanguageVariant,
          step: SPCourseLanguageVariantCreationSteps.SUMMARY,
        }),
      ])
      .pipe(
        catchError((error) => {
          this.notification.error(error?.message);
          return of(null);
        }),
        finalize(() => {
          this.submittingSubject.next(false);
          this.cdr.detectChanges();
        }),
        filter((res) => !!res),
        untilDestroyed(this),
      )
      .subscribe(
        (_) => {
          this.submittingSubject.next(false);
          this.router.navigate([
            'admin',
            'self-paced-courses',
            'details',
            this.route.snapshot.paramMap.get('id'),
            'variant',
            'details',
            this.preSPCourseLanguageVariant.id,
          ]);
        },
        () => this.submittingSubject.next(false),
      );
  }

  ngOnDestroy(): void {
    this.submittingSubject.complete();
  }
}
