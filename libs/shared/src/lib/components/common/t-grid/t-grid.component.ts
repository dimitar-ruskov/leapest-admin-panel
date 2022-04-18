import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { debounceTime, filter } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzTableQueryParams } from 'ng-zorro-antd/table/ng-zorro-antd-table';
import { BehaviorSubject } from 'rxjs';
import {DeferredResource} from "../../../utils/common";
import {IPageable, TGridInputModel} from "../../../models";

@Component({
  selector: 'leap-t-grid',
  templateUrl: './t-grid.component.html',
  styleUrls: ['./t-grid.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class TGridComponent implements OnInit, OnDestroy {
  // The headers and setters in the config should be aligned
  @Input() config: TGridInputModel;
  @Input() showSearch = true;
  @Input() data: DeferredResource<any>;
  @Input() paginationData: IPageable;
  @Input() filterAndSortRefresh: BehaviorSubject<boolean>;
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() searchChange: EventEmitter<string> = new EventEmitter();
  @Output() rowCTAEvent: EventEmitter<any> = new EventEmitter();
  @Output() customActionEvent: EventEmitter<{ dataItem: any; actionKey: string }> = new EventEmitter();
  @Output() emptyActionEvent: EventEmitter<void> = new EventEmitter();
  @Output() queryParamsChange: EventEmitter<NzTableQueryParams> = new EventEmitter();

  searchWatcher: EventEmitter<KeyboardEvent> = new EventEmitter();
  refresh = true;

  constructor() {}

  ngOnInit(): void {
    this.searchWatcher.pipe(debounceTime(500), untilDestroyed(this)).subscribe((val: KeyboardEvent) => {
      this.searchChange.emit(val.target['value']);
    });
    if (this.filterAndSortRefresh) {
      this.filterAndSortRefresh
        .pipe(
          filter((_) => !!_),
          untilDestroyed(this),
        )
        .subscribe((_) => {
          this.refresh = false;
          setTimeout(() => {
            this.refresh = true;
          }, 200);
        });
    }
  }

  onChangePage(e: number) {
    this.pageChange.emit(e);
  }

  searchValueChange(e: KeyboardEvent) {
    this.searchWatcher.emit(e);
  }

  ngOnDestroy() {}

  emitRowCTA(dataItem) {
    if (this.config.rowCTA) {
      this.rowCTAEvent.emit(dataItem);
    }
  }

  emitCustomActionEvent(dataItem, key: string) {
    this.customActionEvent.emit({ dataItem, actionKey: key });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryParamsChange.emit(params);
  }
}
