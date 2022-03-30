import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MasterInternalRepository } from '../../models/internal-repository.model';
import { EnvironmentService } from 'src/app/snatch/services';
import { ConfigDto } from '../../models/config-dto.model';

@Component({
  selector: 'leap-master-internal-repo-tile',
  templateUrl: './master-internal-repo-tile.component.html',
  styleUrls: ['./master-internal-repo-tile.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasterInternalRepoTileComponent implements OnInit {
  static MATERIAL_TYPE_TO_SVG = {
    scormcloud: 'elearning.svg',
    video: 'video.svg',
    exam: 'paper-exam.svg',
    'online-exam': 'online-exam.svg',
    instructorguide: 'ebook.svg',
    googleslides: 'presentation.svg',
    presentation: 'presentation.svg',
    eLearning: 'elearning.svg',
  };

  @Input() m_ir: MasterInternalRepository;
  @Input() showUpArrow: boolean;
  @Input() showDownArrow: boolean;
  @Input() editable: boolean;
  @Input() selectMode: boolean;
  @Input() selected: boolean;
  @Input() selectingVariantsEnabled: boolean;
  @Input() showOneLang: boolean;

  @Output() moveUp: EventEmitter<void> = new EventEmitter();
  @Output() moveDown: EventEmitter<void> = new EventEmitter();
  @Output() selectIndex: EventEmitter<boolean> = new EventEmitter();
  @Output() removeIndex: EventEmitter<void> = new EventEmitter();
  @Output() selectVariant: EventEmitter<void> = new EventEmitter();

  hasMultipleVariants: boolean;
  expanded: boolean;
  maxCollapsedCount = 4;
  languagesToShow: ConfigDto[] = [];

  constructor(private readonly environmentService: EnvironmentService) {}

  ngOnInit(): void {
    this.hasMultipleVariants = [...new Set(this.m_ir.languages)].length > 1 || [...new Set(this.m_ir.types)].length > 1;
    this.languagesToShow = this.m_ir.languages;
  }

  collapse(): void {
    this.expanded = false;
  }

  expand(): void {
    this.expanded = true;
    this.languagesToShow = this.m_ir.languages;
  }

  get languages(): string {
    if (this.languagesToShow.length > 4 && !this.expanded) {
      this.languagesToShow = this.m_ir.languages.slice(0, 4);
    }
    if (!this.showOneLang) {
      return this.joinWithComma(this.languagesToShow);
    }
    return this.m_ir.defaultVariant?.language?.configValue;
  }

  joinWithComma(arr: ConfigDto[]): string {
    if (!arr || !arr[0]) {
      return '';
    } else {
      const uniqueSet = [...new Set(arr.map((a) => a.configValue))];

      return uniqueSet.join(', ');
    }
  }

  clickEvent(): void {
    this.selectIndex.emit(!this.selected);
  }

  deliveryFormatSVGAssetURL(type: string): string {
    if (!type) {
      return;
    }

    const iconValue = !MasterInternalRepoTileComponent.MATERIAL_TYPE_TO_SVG[type]
      ? MasterInternalRepoTileComponent.MATERIAL_TYPE_TO_SVG.instructorguide
      : MasterInternalRepoTileComponent.MATERIAL_TYPE_TO_SVG[type];

    return `${this.environmentService.assetsPath}/delivery-formats/${iconValue}`;
  }
}
