import { Component, ChangeDetectionStrategy, Input, ContentChild, TemplateRef } from '@angular/core';
import { GeneralInfoThumbnailBoxComponent } from './general-info-thumbnail-box/general-info-thumbnail-box.component';
import { GeneralInfoFieldComponent } from './general-info-field/general-info-field.component';
import {GeneralInfoField, MaterialsInfoField} from "../../../models";

@Component({
  selector: 'leap-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralInfoComponent {

  @Input() fields: GeneralInfoField[] | MaterialsInfoField[];
  @ContentChild(GeneralInfoThumbnailBoxComponent) thumbnailBox: GeneralInfoThumbnailBoxComponent;
  @ContentChild('fieldTemplate') fieldTemplate: TemplateRef<GeneralInfoFieldComponent | any>;

  constructor() {}
}
