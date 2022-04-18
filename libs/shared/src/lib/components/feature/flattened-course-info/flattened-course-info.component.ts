import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { FlattenedCourseDetails } from "../../../models";
import { EnvironmentService } from "../../../services/common/environment.service";

//TODO - Update this component using general-info component
@Component({
  selector: 'leap-flattened-course-info',
  templateUrl: './flattened-course-info.component.html',
  styleUrls: ['./flattened-course-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlattenedCourseInfoComponent implements OnInit {
  @Input() course: FlattenedCourseDetails;
  @Input() isEditable: boolean;
  @Output() onEditProp: EventEmitter<string> = new EventEmitter();
  @Output() onUploadThumbnail: EventEmitter<string> = new EventEmitter();
  constructor(public environmentService: EnvironmentService) { }

  ngOnInit(): void {
  }

}
