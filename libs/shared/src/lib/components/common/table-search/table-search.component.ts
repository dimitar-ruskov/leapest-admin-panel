import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'leap-table-search',
  templateUrl: './table-search.component.html',
  styleUrls: ['./table-search.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class TableSearchComponent implements OnInit, OnDestroy {
  private readonly searchPhraseSubject: Subject<string> = new Subject<string>();

  @Input() filter: string;
  @Input() placeholder: string;
  @Output() searchPhraseChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
    this.searchPhraseSubject
      .asObservable()
      .pipe(debounceTime(500), untilDestroyed(this))
      .subscribe((searchPhrase: string) => {
        this.searchPhraseChange.emit(searchPhrase);
      });
  }

  ngOnDestroy(): void {}

  onSearchPhraseChange(searchPhrase: string): void {
    this.searchPhraseSubject.next(searchPhrase);
  }
}
