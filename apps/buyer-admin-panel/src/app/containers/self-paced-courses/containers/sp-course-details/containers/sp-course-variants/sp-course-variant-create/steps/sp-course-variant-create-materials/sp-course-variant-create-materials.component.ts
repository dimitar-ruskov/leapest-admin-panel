import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";
import { Store } from "@ngxs/store";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import produce, { Draft } from "immer";

import {
  GoToSPCourseLanguageVariantCreationStep,
  UpdatePreSPCourseLanguageVariant
} from "../../state/sp-course-variant-create.actions";

import {
  InternalRepositoryMaterial,
  PreSPCourseLanguageVariant,
  SPCourseLanguageVariantCreationSteps
} from "../../../../../../../../../../../../../libs/shared/src/lib/models";
import {
  MaterialDtoHandlerService,
  MaterialDTOsMap,
  NOT_ALL_EXAMS_CONFIGURED_TOOLTIP_TEXT
} from "../../../../../../../../../../../../../libs/shared/src/lib/services/materials/material-dto-handler.service";

@Component({
  selector: 'leap-sp-course-variant-create-materials',
  templateUrl: './sp-course-variant-create-materials.component.html',
  styleUrls: ['./sp-course-variant-create-materials.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MaterialDtoHandlerService],
})
@UntilDestroy()
export class SpCourseVariantCreateMaterialsComponent implements OnInit, OnDestroy {
  notAllExamsConfiguredTooltip = NOT_ALL_EXAMS_CONFIGURED_TOOLTIP_TEXT;
  updatingSubject = new BehaviorSubject<boolean>(false);

  get updating$(): Observable<boolean> {
    return this.updatingSubject.asObservable();
  }

  masterInternalRepositories$: Observable<InternalRepositoryMaterial[]>;
  materialDTOsMap$: Observable<MaterialDTOsMap>;
  areAllMaterialsConfigured$: Observable<boolean>;

  @Input() preSPCourseLanguageVariant: PreSPCourseLanguageVariant;

  constructor(
    private readonly router: Router,
    private readonly materialDTOHandler: MaterialDtoHandlerService,
    private readonly store: Store,
  ) {
    this.masterInternalRepositories$ = this.materialDTOHandler.masterInternalRepositories$;
    this.materialDTOsMap$ = this.materialDTOHandler.materialDTOsMap$;
    this.areAllMaterialsConfigured$ = this.materialDTOHandler.areAllMaterialsConfigured$;
  }

  ngOnInit(): void {
    this.materialDTOHandler.init(this.preSPCourseLanguageVariant.course.masterInternalRepositories);
  }

  ngOnDestroy(): void {
    this.materialDTOHandler.destroy();
    this.updatingSubject.complete();
  }

  onCancel(event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['admin', 'self-paced-courses']);
  }

  onProceed(event: MouseEvent): void {
    event.stopPropagation();
    const updatedPreSPCourseLanguageVariant = produce(
      this.preSPCourseLanguageVariant,
      (draft: Draft<PreSPCourseLanguageVariant>) => {
        draft.course.masterInternalRepositories = this.materialDTOHandler.masterInternalRepositories;
      },
    );

    this.updatingSubject.next(true);
    this.store
      .dispatch(
        new UpdatePreSPCourseLanguageVariant({
          updatedPreSPCourseLanguageVariant,
          step: SPCourseLanguageVariantCreationSteps.MATERIALS,
        }),
      )
      .pipe(
        filter((resource) => !resource.isPending),
        untilDestroyed(this),
      )
      .subscribe(
        () => {
          this.updatingSubject.next(false);
          this.store.dispatch(
            new GoToSPCourseLanguageVariantCreationStep({
              step: SPCourseLanguageVariantCreationSteps.DETAILS,
            }),
          );
        },
        () => this.updatingSubject.next(false),
      );
  }

  onSelectVariant(userType: 'learner' | 'instructor', materialDTOIndex: number, masterIndex: number): void {
    this.materialDTOHandler.selectVariant(userType, materialDTOIndex, masterIndex);
  }
}
