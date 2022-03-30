import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-generate-thumbnail-modal',
  templateUrl: './generate-thumbnail-modal.component.html',
  styleUrls: ['./generate-thumbnail-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenerateThumbnailModalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
