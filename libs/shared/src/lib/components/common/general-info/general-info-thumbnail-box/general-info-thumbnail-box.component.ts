import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import {EnvironmentService} from "../../../../utils/services/common";

@Component({
  selector: 'leap-general-info-thumbnail-box',
  templateUrl: './general-info-thumbnail-box.component.html',
  styleUrls: ['./general-info-thumbnail-box.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralInfoThumbnailBoxComponent {

  @Input() header = 'Course Thumbnail';
  @Input() thumbnailUrl: string;
  @Input() editable = true;

  @Output() generateThumbnail: EventEmitter<void> = new EventEmitter<void>();
  @Output() uploadThumbnail: EventEmitter<void> = new EventEmitter<void>();

  constructor(public environmentService: EnvironmentService) { }

  onGenerateThumbnail(event: MouseEvent): void {
    event.stopPropagation();
    this.generateThumbnail.emit();
  }

  onUploadThumbnail(event: MouseEvent): void {
    event.stopPropagation();
    this.uploadThumbnail.emit();
  }
}
