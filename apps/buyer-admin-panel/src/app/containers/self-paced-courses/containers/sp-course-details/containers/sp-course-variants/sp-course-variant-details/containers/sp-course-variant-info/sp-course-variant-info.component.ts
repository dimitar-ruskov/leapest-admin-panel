import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { Store } from '@ngxs/store';

import {
  GenerateSPCourseLanguageVariantThumbnail,
  UploadSPCourseLanguageVariantThumbnail
} from '../../state/sp-course-variant-details.actions';

import { SPCourseLanguageVariant } from '../../../../../../../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course.model';
import {
  prepareGeneralInfoFields,
  prepareMaterialsFields,
  prepareVariantDetailsFields
} from "../../../../../../../services/sp-course-variants-handler.service";
import {
  GeneralInfoField,
  MaterialsInfoField, S3BucketData
} from "../../../../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {
  CourseThumbnailHandlerService
} from "../../../../../../../../../../../../../libs/shared/src/lib/utils/services/course-thumbnail-handler.service";

@Component({
  selector: 'leap-sp-course-variant-info',
  templateUrl: './sp-course-variant-info.component.html',
  styleUrls: ['./sp-course-variant-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpCourseVariantInfoComponent implements OnInit, OnChanges {

  generalInformationFields: GeneralInfoField[] = [];
  variantDetailsFields: GeneralInfoField[] = [];
  materialsFields: MaterialsInfoField[] = [];

  @Input() spCourseLanguageVariant: SPCourseLanguageVariant;

  @Output() editDetails: EventEmitter<string> = new EventEmitter<string>();

  constructor(private readonly store: Store,
              private readonly courseThumbnailHandlerService: CourseThumbnailHandlerService) { }

  ngOnInit(): void {
    this.generalInformationFields = prepareGeneralInfoFields(this.spCourseLanguageVariant.course);
    this.variantDetailsFields = prepareVariantDetailsFields(this.spCourseLanguageVariant, true);
    this.prepareMaterials();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.spCourseLanguageVariant && !changes.spCourseLanguageVariant.isFirstChange()) {
      this.variantDetailsFields = prepareVariantDetailsFields(changes.spCourseLanguageVariant.currentValue, true);
    }
  }

  onGenerateThumbnail(courseId: string): void {
    this.courseThumbnailHandlerService.generateThumbnail(() => {
      return this.store.dispatch(new GenerateSPCourseLanguageVariantThumbnail({courseId}));
    });
  }

  onUploadThumbnail(thumbnailUrl: string, courseId: string): void {
    this.courseThumbnailHandlerService.uploadThumbnail(thumbnailUrl, (s3BucketData: S3BucketData) => {
      return this.store.dispatch(new UploadSPCourseLanguageVariantThumbnail({courseId, s3BucketData}));
    });
  }

  onEdit(property: string): void {
    this.editDetails.emit(property);
  }

  private prepareMaterials(): void {
    const materials = this.spCourseLanguageVariant.course.masterInternalRepositories;

    this.materialsFields = prepareMaterialsFields(materials);
  }
}
