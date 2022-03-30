import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'leap-type-tile',
  templateUrl: './type-tile.component.html',
  styleUrls: ['./type-tile.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeTileComponent implements OnInit {

  @Input() data: any;
  @Output() onSave = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  public onClick() {
    if (this.data.isDisabled) {
      return null;
    } else {
      this.onSave.emit(this.data);
    }
  }
}
