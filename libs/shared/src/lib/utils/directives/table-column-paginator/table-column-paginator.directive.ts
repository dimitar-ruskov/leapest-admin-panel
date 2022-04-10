import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  Output,
  Renderer2,
  Self,
  SimpleChanges,
} from '@angular/core';
import { NzTableComponent, NzTableInnerScrollComponent } from 'ng-zorro-antd/table';
import { NzResizeObserver } from 'ng-zorro-antd/cdk/resize-observer';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime } from 'rxjs/operators';

const UNABLE_TO_FIND_NZ_TABLE_ERROR =
  'Unable to find nz-table instance. This paginator requires to be used in nz-table thead';
const HIDE_SCROLLBAR_CLASS_NAME = 'ant-table-body--hide-scrollbar';

interface IPaginatorScrollConfig {
  scrollbarVisible: boolean;
  scrollBehavior: 'smooth' | null;
}

const DEFAULT_SCROLL_CONFIG: IPaginatorScrollConfig = {
  scrollbarVisible: false,
  scrollBehavior: 'smooth',
};

@Directive({
  selector: '[leapTableColumnPaginator]',
  exportAs: 'leapTableColumnPaginator',
})
@UntilDestroy()
export class TableColumnPaginatorDirective implements AfterViewInit, OnChanges {
  @Input('leapTableColumnPaginator') enabled = true;
  @Input() fixedColumnsWidth: number;
  @Input() columnMinWidth: number;
  @Input() paginatedColumns: number;
  @Input() step = 1;

  private readonly initialPage = 0;
  private tableScrollContainer: NzTableInnerScrollComponent<any>;
  private scrollableContainer: HTMLElement;
  private scrollableContainerSize$: Observable<ResizeObserverEntry[]>;
  private tableContainerWidth: number;
  private paginatorViewportWidth: number;
  private maxVisibleColumns: number;

  private columnWidth: number;

  get columnWidthPx(): string {
    return convertToPx(this.columnWidth);
  }

  spacerWidth: number;

  get spacerWidthPx(): string {
    return convertToPx(this.spacerWidth);
  }

  private page: number;

  get lastPage(): number {
    return this.paginatedColumns - this.maxVisibleColumns;
  }

  get canGoLeft(): boolean {
    return this.page > 0;
  }

  get canGoRight(): boolean {
    return this.page < this.lastPage;
  }

  get paginationPossible(): boolean {
    return this.lastPage > 0;
  }

  @Output() resized: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private readonly renderer: Renderer2,
    private readonly ngZone: NgZone,
    private readonly nzResizeObserverService: NzResizeObserver,
    @Self() @Inject(NzTableComponent) private readonly table: NzTableComponent<any>,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { paginatedColumns } = changes;

    if (paginatedColumns && paginatedColumns.currentValue !== paginatedColumns.previousValue) {
      this.setSpacer();
    }

    // TODO: Improvement: add recalculation logic for all dynamic values
  }

  ngAfterViewInit(): void {
    if (this.table) {
      this.tableScrollContainer = this.table.nzTableInnerScrollComponent;
      this.scrollableContainer = this.table.nzTableInnerScrollComponent.tableBodyElement.nativeElement;
      this.scrollableContainerSize$ = this.nzResizeObserverService.observe(this.scrollableContainer);
      this.configureScroll(DEFAULT_SCROLL_CONFIG);
      this.initPaginator(this.scrollableContainer.clientWidth);

      this.scrollableContainerSize$
        .pipe(debounceTime(100), untilDestroyed(this))
        .subscribe((val: ResizeObserverEntry[]) => {
          if (val && val.length) {
            const width = val[0].contentRect.width;

            this.ngZone.run(() => {
              this.initPaginator(width);
              this.resized.emit();
            });
          }
        });
    } else {
      throw new Error(UNABLE_TO_FIND_NZ_TABLE_ERROR);
    }
  }

  private initPaginator(tableWidth: number): void {
    this.tableContainerWidth = tableWidth;
    this.paginatorViewportWidth = this.tableContainerWidth - this.fixedColumnsWidth;
    this.setPaginatedColumnWidth();
    this.setSpacer();
    this.resetPagination();
  }

  private setPaginatedColumnWidth(): void {
    const canFitColumns = calcMaxVisibleColumns(this.paginatorViewportWidth, this.columnMinWidth);

    this.columnWidth = calcColumnWidth(this.paginatorViewportWidth, canFitColumns);
    this.maxVisibleColumns = calcMaxVisibleColumns(this.paginatorViewportWidth, this.columnWidth);
  }

  private setSpacer(): void {
    this.spacerWidth =
      this.paginatedColumns < this.maxVisibleColumns
        ? this.paginatorViewportWidth - this.paginatedColumns * this.columnWidth
        : 0;
  }

  private configureScroll({ scrollbarVisible, scrollBehavior }: IPaginatorScrollConfig): void {
    if (scrollbarVisible) {
      this.renderer.removeClass(this.scrollableContainer, HIDE_SCROLLBAR_CLASS_NAME);
    } else {
      this.renderer.addClass(this.scrollableContainer, HIDE_SCROLLBAR_CLASS_NAME);
    }

    this.renderer.setStyle(this.scrollableContainer, 'scrollBehavior', scrollBehavior);
  }

  private resetPage(): void {
    this.page = this.initialPage;
  }

  private resetPagination(): void {
    this.resetPage();
    this.scrollableContainer.scrollTo({ left: 0 });
  }

  paginate(direction: -1 | 1): void {
    let page = this.page;

    page += direction * this.step;

    if (page >= 0 && page <= this.lastPage) {
      this.scrollableContainer.scrollTo({ left: this.columnWidth * page });
      this.page = page;
    }
  }
}

function calcMaxVisibleColumns(paginatorViewportWidth: number, columnWidth: number): number {
  return (paginatorViewportWidth - (paginatorViewportWidth % columnWidth)) / columnWidth;
}

function calcColumnWidth(paginatorViewportWidth: number, maxVisibleColumns: number): number {
  return Math.floor(paginatorViewportWidth / maxVisibleColumns);
}

function convertToPx(value: number): string {
  return `${value}px`;
}
