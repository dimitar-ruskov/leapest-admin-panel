import {
  Component,
  ChangeDetectionStrategy,
  Input,
  TrackByFunction,
  forwardRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddCourseMaterialModalComponent } from './modals/add-course-material-modal/add-course-material-modal.component';
import { InternalRepositoryMaterial } from '../../models/internal-repository.model';
import { distinctUntilChanged, map, take, tap } from 'rxjs/operators';
import { AdminCoursesService } from '../../services/admin-courses.service';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { MaterialDtoHandlerService } from '../../common/handlers/material-dto-handler.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EnvironmentService } from '../../../snatch/services';

@Component({
  selector: 'leap-course-materials-input',
  templateUrl: './course-materials-input.component.html',
  styleUrls: ['./course-materials-input.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MaterialDtoHandlerService,
    EnvironmentService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CourseMaterialsInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CourseMaterialsInputComponent),
      multi: true,
    },
  ],
})
@UntilDestroy()
export class CourseMaterialsInputComponent implements ControlValueAccessor, Validator, OnDestroy, OnInit {
  @Input() noMaterialsLabel: string;
  @Input() readonly: string;
  @Input() selectingVariantsEnabled: boolean;
  @Input() userType: 'learner' | 'instructor';
  @Input() showOneLang: boolean;
  @Input() courseName: string;
  @Input() isEditable = true;

  isDisabled: boolean;

  private readonly repositoriesSubject = new BehaviorSubject<InternalRepositoryMaterial[]>([]);
  repositories$: Observable<InternalRepositoryMaterial[]> = this.repositoriesSubject.asObservable();

  trackByFn: TrackByFunction<InternalRepositoryMaterial> = (index, item) => item.id;

  get addedRepositories(): InternalRepositoryMaterial[] {
    return this.repositoriesSubject.getValue() || [];
  }

  get addedRepositoriesIds(): number[] {
    if (!this.addedRepositories) {
      return [];
    }
    return this.addedRepositories.map((repository) => repository.id);
  }

  get isMaterialButtonEnabled() {
    if (this.showOneLang) {
      return !this.readonly && (this.environment.envName === 'preview' || this.environment.envName === 'test');
    }

    return !this.readonly;
  }

  private onChange: (value: InternalRepositoryMaterial[]) => void = () => {
    /*empty fn*/
  };

  private onTouched = () => {
    /*empty fn*/
  };

  constructor(
    private readonly modalService: NzModalService,
    private readonly adminCoursesService: AdminCoursesService,
    private readonly materialDtoHandler: MaterialDtoHandlerService,
    private readonly environment: EnvironmentService,
  ) {}

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(repositories: InternalRepositoryMaterial[]): void {
    this.repositoriesSubject.next(repositories || []);
    if (this.selectingVariantsEnabled && repositories) {
      this.materialDtoHandler.init(repositories);
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isValid = value && Array.isArray(control.value) && value.length;

    return (
      !isValid && {
        required: true,
      }
    );
  }

  ngOnInit(): void {
    this.materialDtoHandler.masterInternalRepositories$
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((updatedRepositoriesList) => {
        this.updateRepositoriesList(updatedRepositoriesList);
      });
  }

  ngOnDestroy(): void {
    this.materialDtoHandler.destroy();
    this.repositoriesSubject.complete();
  }

  openMaterialModal(): void {
    this.modalService.create({
      nzTitle: 'Add Material',
      nzContent: AddCourseMaterialModalComponent,
      nzComponentParams: {
        addedIds: this.addedRepositoriesIds,
        courseName: this.courseName,
      },
      nzCancelText: 'Cancel',
      nzOkText: 'Add Material',
      nzOkDisabled: true,
      nzWidth: '660px',
      nzOnOk: async (instance) => {
        const selectedIds = instance.selectedIds;

        return this.adminCoursesService
          .getInternalRepositoryMaterialDetails(selectedIds)
          .pipe(
            map((t) => t.data),
            tap((res: InternalRepositoryMaterial[]) => {
              if (res) {
                res = res.map((x) => ({ ...x, userType: { configKey: this.userType } }));
                const updatedRepositoriesList = [...this.addedRepositories, ...res];
                this.updateRepositoriesList(updatedRepositoriesList);
              }
            }),
            take(1),
          )
          .toPromise();
      },
    });
  }

  onRemove(index: number): void {
    const updatedRepositoriesList = [...this.addedRepositories];

    updatedRepositoriesList.splice(index, 1);
    this.updateRepositoriesList(updatedRepositoriesList);
  }

  onMoveUp(index: number): void {
    const updatedRepositoriesList = moveUp(this.addedRepositories, index);

    this.updateRepositoriesList(updatedRepositoriesList);
  }

  onMoveDown(index: number): void {
    const updatedRepositoriesList = moveDown(this.addedRepositories, index);

    this.updateRepositoriesList(updatedRepositoriesList);
  }

  openSelectModal(index: number): void {
    this.materialDtoHandler.selectVariant(this.userType, index, index);
  }

  private updateRepositoriesList(updatedRepositoriesList: InternalRepositoryMaterial[]): void {
    this.onChange(updatedRepositoriesList);
    this.repositoriesSubject.next(updatedRepositoriesList);
    if (this.selectingVariantsEnabled && updatedRepositoriesList) {
      this.materialDtoHandler.init(updatedRepositoriesList);
    }
  }
}

function moveUp(items: InternalRepositoryMaterial[], i: number): InternalRepositoryMaterial[] {
  const clone = [...items];

  [clone[i - 1], clone[i]] = [clone[i], clone[i - 1]];

  return clone;
}

function moveDown(items: InternalRepositoryMaterial[], i: number): InternalRepositoryMaterial[] {
  const clone = [...items];

  [clone[i], clone[i + 1]] = [clone[i + 1], clone[i]];

  return clone;
}
