import {Component, OnInit, ChangeDetectionStrategy, Input, TemplateRef} from '@angular/core';
import { DeferredResource } from 'src/app/snatch/utils/deferred-resource';
import { NzSkeletonParagraph } from 'ng-zorro-antd/skeleton';

@Component({
  selector: 'leap-deferred-container',
  templateUrl: './deferred-container.component.html',
  styleUrls: ['./deferred-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeferredContainerComponent implements OnInit {
  @Input()
  deferredResource: DeferredResource<unknown>;

  @Input()
  nzSkeletonOpts: NzSkeletonParagraph;

  @Input()
  templateRef: TemplateRef<unknown>;

  @Input()
  skeletonRef?: TemplateRef<unknown> | null;

  constructor() { }

  ngOnInit() { }
}
