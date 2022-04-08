import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { IR_TILES, IRTile } from '../../../../../../../../../../libs/shared/src/lib/models/interfaces/internal-repo/internal-repository-create-step.model';

@Component({
  selector: 'leap-internal-repo-type-modal',
  templateUrl: './internal-repo-type-modal.component.html',
  styleUrls: ['./internal-repo-type-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalRepoTypeModalComponent {
  @Input() data;
  @Output() selectType = new EventEmitter<IRTile>();
  @Output() onClose = new EventEmitter<void>();

  public tiles: IRTile[] = IR_TILES;

  constructor() {}

  public onTileClicked(e: IRTile): void {
    this.selectType.emit(e);
  }

  public onCancel(): void {
    this.onClose.emit();
  }
}
