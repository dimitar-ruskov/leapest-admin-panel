import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  TrackByFunction,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, skipUntil, switchMap, take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzModalRef } from 'ng-zorro-antd/modal';

import {IPageable, MasterInternalRepository} from "../../../models/interfaces";
import {AdminCoursesService} from "../../../utils/services";

@Component({
  selector: 'leap-add-course-material-modal',
  templateUrl: './add-course-material-modal.component.html',
  styleUrls: ['./add-course-material-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class AddCourseMaterialModalComponent implements OnInit {
  private readonly searchValueSubject = new BehaviorSubject<string>('');
  private readonly initializedSubject: Subject<void> = new Subject<void>();

  @Input() addedIds: number[];
  @Input() courseName: string;

  pending: boolean;
  searchValue = '';
  internalReposParamsSubject: BehaviorSubject<IPageable> = new BehaviorSubject({ page: 1, limit: 10, filter: '' });
  internalRepos: MasterInternalRepository[] = [];

  selectedInternalRepoIds: Set<number> = new Set();

  get selectedIds(): number[] {
    return [...this.selectedInternalRepoIds.values()];
  }

  trackByFn: TrackByFunction<MasterInternalRepository> = (index, item) => item.id;

  constructor(
    private readonly adminCoursesService: AdminCoursesService,
    private readonly cdr: ChangeDetectorRef,
    private readonly modalRef: NzModalRef,
  ) {}

  ngOnInit(): void {
    this.pending = true;
    this.cdr.markForCheck();

    this.internalReposParamsSubject
      .pipe(
        distinctUntilChanged(),
        switchMap((params) => {
          return this.adminCoursesService.getInternalRepositoryMaterials(params);
        }),
        map((t) => t.data),
        untilDestroyed(this),
      )
      .subscribe(
        (res) => {
          if (res) {
            this.pending = false;
            const result = res.resultList.data;
            const filteredResult = result.filter((repo) => !this.addedIds.includes(repo.id));

            this.internalRepos = [...this.internalRepos, ...filteredResult];
            this.initializedSubject.next(null);
            this.cdr.markForCheck();
          }
        },
        () => {
          this.pending = false;
        },
      );

    this.searchValueSubject
      .asObservable()
      .pipe(skipUntil(this.initializedSubject.asObservable().pipe(take(1))), debounceTime(500), untilDestroyed(this))
      .subscribe((searchValue: string) => {
        const currentParams = this.internalReposParamsSubject.getValue();

        this.internalRepos = [];
        this.pending = true;
        this.internalReposParamsSubject.next({ ...currentParams, filter: searchValue });
        this.cdr.markForCheck();
      });
  }

  searchValueChange(searchValue: string): void {
    this.searchValueSubject.next(searchValue);
  }

  onSelectInternalRepo(selected: boolean, id: number): void {
    if (!selected) {
      this.selectedInternalRepoIds.delete(id);
    } else {
      this.selectedInternalRepoIds.add(id);
    }

    this.modalRef.updateConfig({
      ...this.modalRef.getConfig(),
      nzOkDisabled: !this.selectedInternalRepoIds.size,
    });
  }

  onScroll(): void {
    const currentParams = this.internalReposParamsSubject.getValue();

    this.internalReposParamsSubject.next({ ...currentParams, page: currentParams.page + 1 });
  }
}
