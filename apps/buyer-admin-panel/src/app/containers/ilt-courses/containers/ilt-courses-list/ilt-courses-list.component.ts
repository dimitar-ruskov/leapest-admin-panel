import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { take, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";

import { IltCoursesListState } from "./state/ilt-courses-list.state";
import { ChangeILTCoursesListTab, CreatePreILTCourse } from "./state/ilt-courses-list.actions";
import { IGlobalStateModel } from "../../../../state/state.model";

import { IKeyValuePair, PreILTCourse } from "../../../../../../../../libs/shared/src/lib/models";
import {
  CreateNewCourseModalComponent
} from "../../../../../../../../libs/shared/src/lib/components/modals/create-new-course-modal/create-new-course-modal.component";

@Component({
  selector: 'leap-ilt-courses-list',
  templateUrl: './ilt-courses-list.component.html',
  styleUrls: ['./ilt-courses-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IltCoursesListComponent implements OnInit {
  @Select((state: IGlobalStateModel) => state.core.iltLanguageDictionary)
  iltLanguageDictionary$: Observable<IKeyValuePair[]>;

  @Select(IltCoursesListState.activeTab)
  activeTab$: Observable<number>;

  constructor(private readonly store: Store, private readonly modalService: NzModalService) {}

  ngOnInit(): void {
    this.store.dispatch(new ChangeILTCoursesListTab({ activeTab: 0 }));
  }

  onSelectTab(activeTab: number): void {
    this.store.dispatch(new ChangeILTCoursesListTab({ activeTab }));
  }

  onCreateCourse(event: MouseEvent): void {
    event.stopPropagation();
    this.iltLanguageDictionary$.pipe(take(1)).subscribe((languageDictionary) => {
      const modal: NzModalRef = this.modalService.create({
        nzTitle: 'Create New Instructor - led Course?',
        nzComponentParams: {
          languageDictionary,
        },
        nzWidth: 660,
        nzContent: CreateNewCourseModalComponent,
        nzFooter: [
          {
            label: 'Cancel',
            type: 'default',
            onClick: () => modal.destroy(),
          },
          {
            label: 'Proceed',
            type: 'primary',
            disabled: (d) => d.form.invalid,
            onClick: async (instance: CreateNewCourseModalComponent) => {
              const formValue = instance.form.getRawValue();
              const updatedCourse: Partial<PreILTCourse> = {
                name: formValue.name,
                expressCourse: {
                  language: { configKey: formValue.languages },
                },
                isInternal: true,
                format: { configKey: 'instructorLedCourse', configValue: 'Instructor Led Course' },
              };

              return this.store
                .dispatch(new CreatePreILTCourse({ updatedCourse }))
                .pipe(tap(() => modal.destroy()))
                .toPromise();
            },
          },
        ],
      });
    });
  }
}
