import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'leap-editor-char-count',
  templateUrl: './editor-char-count.component.html',
  styleUrls: ['./editor-char-count.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorCharCountComponent {
  @HostBinding('class.leap-editor-char-count') className = true;

  @Input() current: number;
  @Input() limit: number;
}
