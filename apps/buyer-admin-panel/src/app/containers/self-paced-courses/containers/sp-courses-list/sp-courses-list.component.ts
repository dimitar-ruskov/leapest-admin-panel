import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { take, tap } from "rxjs/operators";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";

import { SpCoursesListState } from "./state/sp-courses-list.state";
import { ChangeSelfPacedCoursesListTab, CreatePreSelfPacedCourse } from "./state/sp-courses-list.actions";

import { IKeyValuePair, PreSelfPacedCourse } from "../../../../../../../../libs/shared/src/lib/models";
import {
  CreateNewCourseModalComponent
} from "../../../../../../../../libs/shared/src/lib/components/modals/create-new-course-modal/create-new-course-modal.component";

@Component({
  selector: 'leap-sp-courses-list',
  templateUrl: './sp-courses-list.component.html',
  styleUrls: ['./sp-courses-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpCoursesListComponent implements OnInit {
  @Select(SpCoursesListState.activeTab)
  activeTab$: Observable<number>;

  @Select(SpCoursesListState.languageDictionary)
  languageDictionary$: Observable<IKeyValuePair[]>;

  constructor(private readonly store: Store, private readonly modalService: NzModalService) {}

  ngOnInit(): void {
    this.store.dispatch(new ChangeSelfPacedCoursesListTab({ activeTab: 0 }));
  }

  onSelectTab(activeTab: number): void {
    this.store.dispatch(new ChangeSelfPacedCoursesListTab({ activeTab }));
  }

  onCreateCourse(event: MouseEvent): void {
    event.stopPropagation();
    this.languageDictionary$.pipe(take(1)).subscribe((languageDictionary) => {
      const modal: NzModalRef = this.modalService.create({
        nzTitle: 'Create New Self-paced Course?',
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
              const updatedCourse: Partial<PreSelfPacedCourse> = {
                name: formValue.name,
                expressCourse: {
                  language: { configKey: formValue.languages },
                },
                isInternal: true,
                format: { configKey: 'selfPacedCourse', configValue: 'Self Paced Course' },
              };

              return this.store
                .dispatch(new CreatePreSelfPacedCourse({ updatedCourse }))
                .pipe(tap(() => modal.destroy()))
                .toPromise();
            },
          },
        ],
      });
    });
  }
}
