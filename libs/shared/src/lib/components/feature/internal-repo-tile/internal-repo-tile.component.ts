import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import {InternalRepositoryDTO} from "../../../models";
import {EnvironmentService} from "../../../services/common";


const SELECT_VARIANT_LABEL = 'Select variant';

@Component({
  selector: 'leap-internal-repo-tile',
  templateUrl: './internal-repo-tile.component.html',
  styleUrls: ['./internal-repo-tile.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InternalRepoTileComponent {

  static MATERIAL_TYPE_TO_SVG = {
    scormcloud: 'elearning.svg',
    video: 'video.svg',
    exam: 'paper-exam.svg',
    'online-exam': 'online-exam.svg',
    instructorguide: 'ebook.svg',
    courseBook: 'ebook.svg',
    googleslides: 'presentation.svg',
    presentation: 'presentation.svg',
    eLearning: 'elearning.svg'
  };

  selectVariantLabel = SELECT_VARIANT_LABEL;

  @Input() ir: InternalRepositoryDTO;
  @Input() selectable: boolean;

  @Output() selectVariant: EventEmitter<void> = new EventEmitter();

  constructor(public environmentService: EnvironmentService) {
  }

  deliveryFormatSVGAssetURL(type: string): string {
    if (!type) {
      return '';
    }

    const iconValue = !InternalRepoTileComponent.MATERIAL_TYPE_TO_SVG[type]
      ? InternalRepoTileComponent.MATERIAL_TYPE_TO_SVG.instructorguide
      : InternalRepoTileComponent.MATERIAL_TYPE_TO_SVG[type];

    return `${this.environmentService.assetsPath}/delivery-formats/${iconValue}`;
  }
}
