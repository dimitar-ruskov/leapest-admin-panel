import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { SPCourseLanguageVariant } from "../../../../../../../../../../../../../libs/shared/src/lib/models";


@Component({
  selector: 'leap-sp-course-variant-learners',
  templateUrl: './sp-course-variant-learners.component.html',
  styleUrls: ['./sp-course-variant-learners.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpCourseVariantLearnersComponent {
  @Input() spCourseLanguageVariant: SPCourseLanguageVariant;
}
