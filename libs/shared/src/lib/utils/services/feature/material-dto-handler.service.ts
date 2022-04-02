import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import produce, { Draft } from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {ConfigDto, InternalRepositoryDTO, InternalRepositoryMaterial} from "../../../models/interfaces";
import {
  VariantSelectModalComponent,
  VariantSelectModalFormValue
} from "../../../components/modals/variant-select-modal/variant-select-modal.component";

export const NOT_ALL_EXAMS_CONFIGURED_TOOLTIP_TEXT = 'Please select the activation date for exams';

export interface IndexedMIR extends InternalRepositoryMaterial {
  masterIndex: number;
}

export interface MaterialDTO {
  dto: InternalRepositoryDTO;
  selectable: boolean;
  masterIndex: number;
}

export interface MaterialDTOsMap {
  learner: MaterialDTO[];
  instructor: MaterialDTO[];
}

export interface SelectVariantModalComponentParams {
  variantOptions: InternalRepositoryDTO[];
  initFormValue: {
    variantId: number;
    name: string;
    language: ConfigDto;
    type: ConfigDto;
  };
}

@Injectable({providedIn: 'root'})
export class MaterialDtoHandlerService {
  private readonly _masterInternalRepositoriesSubject = new BehaviorSubject<InternalRepositoryMaterial[]>([]);

  get masterInternalRepositories(): InternalRepositoryMaterial[] {
    return this._masterInternalRepositoriesSubject.getValue();
  }

  private readonly _materialDTOsMapSubject = new BehaviorSubject<MaterialDTOsMap>({
    learner: [],
    instructor: [],
  });

  get materialDTOsMap(): MaterialDTOsMap {
    return this._materialDTOsMapSubject.getValue();
  }

  masterInternalRepositories$: Observable<InternalRepositoryMaterial[]>;
  materialDTOsMap$: Observable<MaterialDTOsMap>;
  areAllMaterialsConfigured$: Observable<boolean>;

  constructor(private readonly store: Store, private readonly modalService: NzModalService) {
    this.masterInternalRepositories$ = this._masterInternalRepositoriesSubject.asObservable();
    this.materialDTOsMap$ = this._materialDTOsMapSubject.asObservable();
    this.areAllMaterialsConfigured$ = this.masterInternalRepositories$.pipe(
      map((masterInternalRepositories) => areAllMaterialsConfigured(masterInternalRepositories)),
    );
  }

  init(masterInternalRepositories: InternalRepositoryMaterial[]): void {
    this._masterInternalRepositoriesSubject.next(masterInternalRepositories);
    this._materialDTOsMapSubject.next(this.getMaterialDTOs(masterInternalRepositories));
  }

  destroy(): void {
    this._masterInternalRepositoriesSubject.complete();
    this._materialDTOsMapSubject.complete();
  }

  selectVariant(userType: 'learner' | 'instructor', materialDTOIndex: number, masterIndex: number): void {
    const masterInternalRepository = this.masterInternalRepositories[masterIndex];
    const materialDTO: MaterialDTO = getMaterialDTOAt(this.materialDTOsMap, userType, materialDTOIndex);

    const nzComponentParams = this.getModalComponentParams(masterInternalRepository, materialDTO);

    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Select Material Variant',
      nzContent: VariantSelectModalComponent,
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzComponentParams,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'text',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (instance) => !instance.form.valid,
          onClick: (instance: VariantSelectModalComponent) => {
            this.updateMasterInternalRepositories(masterIndex, instance.form.getRawValue());
            this.updateMaterialDTOs(userType, materialDTOIndex, masterIndex);
            modal.destroy();
          },
        },
      ],
    });
  }

  updateMasterInternalRepositories(masterIndex: number, formValue: VariantSelectModalFormValue): void {
    const masterInternalRepository = this.masterInternalRepositories[masterIndex];
    const dto = masterInternalRepository.internalRepositoryDTOs.find(
      (e) => e.language.configKey === formValue.language && e.type.configKey === formValue.delivery,
    );

    const updatedMasterInternalRepositories = produce(
      this.masterInternalRepositories,
      (draft: Draft<InternalRepositoryMaterial[]>) => {
        draft[masterIndex].defaultVariant = dto;
        draft[masterIndex].defaultVariantSKU = dto.sku;
      },
    );

    this._masterInternalRepositoriesSubject.next(updatedMasterInternalRepositories);
  }

  updateMaterialDTOs(userType: 'learner' | 'instructor', materialDTOIndex: number, masterIndex: number): void {
    const materialDTOs = this.materialDTOsMap;
    const masterInternalRepository = this.masterInternalRepositories[masterIndex];
    const updatedMaterialDTOs = produce(materialDTOs, (draft) => {
      draft[userType][materialDTOIndex] = {
        ...getMaterialDTOAt(materialDTOs, userType, materialDTOIndex),
        dto: { ...masterInternalRepository.defaultVariant },
      };
    });

    this._materialDTOsMapSubject.next(updatedMaterialDTOs);
  }

  private getModalComponentParams(
    masterInternalRepository: InternalRepositoryMaterial,
    materialDTO: MaterialDTO,
  ): SelectVariantModalComponentParams {
    const { internalRepositoryDTOs, name, defaultVariant } = masterInternalRepository;

    return {
      variantOptions: internalRepositoryDTOs,
      initFormValue: {
        variantId: materialDTO.dto.id,
        name,
        language: defaultVariant.language,
        type: defaultVariant.type,
      },
    };
  }

  private getMaterialDTOs(masterInternalRepositories: InternalRepositoryMaterial[]): MaterialDTOsMap {
    const indexedMIRs = indexMIRs(masterInternalRepositories);

    return {
      learner: this.prepareMaterialDTOs(indexedMIRs, 'learner'),
      instructor: this.prepareMaterialDTOs(indexedMIRs, 'instructor'),
    };
  }

  private prepareMaterialDTOs(indexedMIRs: IndexedMIR[], userType: 'learner' | 'instructor'): MaterialDTO[] {
    return indexedMIRs
      .map((m) => (m.userType ? m : { ...m, userType: { configKey: 'learner' } })) // fix for self-placed courses
      .filter((m) => m.userType.configKey === userType)
      .map((m) => {
        return {
          dto: m.defaultVariant,
          selectable: m.internalRepositoryDTOs.length > 1 || m.type.configKey === 'exam',
          masterIndex: m.masterIndex,
        };
      });
  }
}

export function isExam(repositoryMaterial: InternalRepositoryMaterial): boolean {
  return repositoryMaterial.type.configKey === 'exam';
}

export function indexMIRs(masterInternalRepositories: InternalRepositoryMaterial[]): IndexedMIR[] {
  return masterInternalRepositories.map((m, index) => ({ ...m, masterIndex: index }));
}

export function areAllMaterialsConfigured(repositoryMaterials: InternalRepositoryMaterial[]): boolean {
  return repositoryMaterials.every((repositoryMaterial: InternalRepositoryMaterial) =>
    isExam(repositoryMaterial) ? !!repositoryMaterial.accessStartDate : true,
  );
}

export function getMaterialDTOAt(
  materialDTOs: MaterialDTOsMap,
  userType: 'instructor' | 'learner',
  materialDTOIndex: number,
): MaterialDTO {
  return materialDTOs[userType][materialDTOIndex];
}
