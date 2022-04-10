import { ActiveSelfPacedCourse, SPCourseLanguageVariant } from '../models/self-paced-course.model';
import { GeneralInfoField, MaterialsInfoField } from '../../../components/general-info/models/general-info-field.model';
import { PreSPCourseLanguageVariant } from '../models/sp-course-language-variant.model';
import { SELF_REGISTRATION_OPTIONS_MAP } from './self-registration-options';
import { REGISTRATION_APPROVAL_OPTIONS_MAP } from './registration-approval-options';
import { COURSE_COMPLETION_OPTIONS_MAP } from './course-completion-options';
import { InternalRepositoryDTO, InternalRepositoryMaterial } from '../../../models/internal-repository.model';
import { ITrainingManager } from '../../../models/ilt-event.model';

export function prepareGeneralInfoFields(course: ActiveSelfPacedCourse): GeneralInfoField[] {
  return [
    {
      id: 'type',
      title: 'Course Type',
      value: {
        content: 'Self-paced course',
      },
    },
    {
      id: 'name',
      title: 'Course Name',
      value: {
        content: course.name,
        styles: { fontSize: '20px' },
      },
    },
    {
      id: 'category',
      title: 'Category',
      value: {
        content: course.categoryName,
      },
    },
    {
      id: 'subcategory',
      title: 'Sub-category',
      value: {
        content: course.subcategoryName,
      },
    },
    {
      id: 'keywords',
      title: 'Keywords',
      value: {
        content: course.keywords?.join(','),
      },
    },
    {
      id: 'level',
      title: 'Level',
      value: {
        content: course.level?.configValue,
      },
    },
    {
      id: 'createdBy',
      title: 'Created By',
      value: {
        content: course.createdBy,
      },
    },
    {
      id: 'description',
      title: 'Course Description',
      value: {
        content: course.description,
        contentType: 'html',
      },
    },
    {
      id: 'objectives',
      title: 'Course Objectives',
      value: {
        content: course.objectives,
        contentType: 'html',
      },
    },
    {
      id: 'target-audience',
      title: 'Target Audience',
      value: {
        content: course.targetAudience,
        contentType: 'html',
      },
    },
  ];
}

export function prepareVariantDetailsFields(
  preSPCourseLanguageVariant: PreSPCourseLanguageVariant | SPCourseLanguageVariant,
  editable = false,
): GeneralInfoField[] {
  const {
    language,
    trainingManagerName,
    trainingManagerEmail,
    trainingManagers,
    selfRegistration,
    course: { automaticApproval, externalSKU, specificExternalSKU },
    automaticCourseCompletion,
  } = preSPCourseLanguageVariant;

  return [
    {
      id: 'language',
      title: 'Variant Language',
      value: {
        content: language?.configValue,
      },
    },
    {
      id: 'external-sku',
      title: specificExternalSKU ? 'Custom Course Code' : 'Internal Course Code / SKU',
      value: {
        content: externalSKU,
      },
      editable: true,
    },
    {
      id: 'trainingManager',
      title: 'Training Manager',
      value: {
        content: trainingManagers?.map((trainingManager: ITrainingManager) => ({
          name: trainingManager.trainingManagerName || 'N/A',
          email: trainingManager.trainingManagerEmail,
        })) || [
          {
            name: trainingManagerName,
            email: trainingManagerEmail,
          },
        ],
        contentType: 'user',
      },
      editable,
    },
    {
      id: 'selfRegistration',
      title: 'Self Registration',
      value: {
        content: SELF_REGISTRATION_OPTIONS_MAP.get(selfRegistration),
      },
      editable,
    },
    {
      id: 'registrationApproval',
      title: 'Registration Approval',
      value: {
        content: REGISTRATION_APPROVAL_OPTIONS_MAP.get(automaticApproval),
      },
      editable,
    },
    {
      id: 'courseCompletion',
      title: 'Course Completion',
      value: {
        content: automaticCourseCompletion
          ? 'Automatically, once the exam results are known'
          : COURSE_COMPLETION_OPTIONS_MAP.get(automaticCourseCompletion),
      },
      editable,
    },
  ];
}

export function prepareMaterialsMap(
  masterInternalRepositories: InternalRepositoryMaterial[],
): {
  learner: InternalRepositoryDTO[];
  instructor: InternalRepositoryDTO[];
} {
  const materialDTOsMap = { learner: [], instructor: [] };

  masterInternalRepositories.forEach((repo) => {
    const userType = repo.userType.configKey;

    materialDTOsMap[userType].push(repo.defaultVariant);
  });

  return materialDTOsMap;
}

export function prepareMaterialsFields(masterInternalRepositories: InternalRepositoryMaterial[]): MaterialsInfoField[] {
  const materialDTOsMap = prepareMaterialsMap(masterInternalRepositories);

  return [
    {
      id: 'learnerMaterials',
      title: 'Learner Materials',
      value: {
        content: {
          materials: materialDTOsMap.learner,
          noMaterialsLabel: 'This variant has no materials for learners.',
        },
        contentType: 'materials',
      },
    },
  ];
}
