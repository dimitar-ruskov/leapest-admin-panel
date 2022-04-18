import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from "@angular/core";
import { Router } from "@angular/router";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";

import { NzTableQueryParams } from "ng-zorro-antd/table";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";

import {
  ChangeInstructorsPaginationParams,
  GetInstructors,
  ResetInstructorsState
} from "./state/instructors-list.actions";
import { InstructorsListState } from "./state/instructors-list.state";
import {
  InstructorCreateModalComponent
} from "../../../../../../../../libs/shared/src/lib/components/modals/instructor-create-modal/instructor-create-modal.component";
import {
  InstructorsService
} from "../../../../../../../../libs/shared/src/lib/services/instructors/instructors.service";

import { InstructorLite } from "../../../../../../../../libs/shared/src/lib/models";
import {
  createPageableFromTableQueryParams,
  DeferredResource
} from "../../../../../../../../libs/shared/src/lib/utils/common";

@Component({
  selector: 'leap-instructors-list',
  templateUrl: './instructors-list.component.html',
  styleUrls: ['./instructors-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorsListComponent implements OnInit {
  @Select(InstructorsListState.loading)
  loading$: Observable<boolean>;

  @Select(InstructorsListState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(InstructorsListState.instructors)
  instructors$: Observable<InstructorLite[]>;

  @Select(InstructorsListState.pageSize)
  pageSize$: Observable<number>;

  @Select(InstructorsListState.total)
  total$: Observable<number>;

  @Select(InstructorsListState.pageIndex)
  pageIndex$: Observable<number>;

  trackByFn: TrackByFunction<InstructorLite> = (index, item) => item.id;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly service: InstructorsService,
    private readonly modalService: NzModalService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch([new ResetInstructorsState()]);
  }

  public getName(instructor): string {
    return instructor.firstName ? `${instructor.firstName} ${instructor.lastName}` : 'N/A';
  }

  public onSearchChange(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeInstructorsPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetInstructors(),
    ]);
  }

  public onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([new ChangeInstructorsPaginationParams({ pageable }), new GetInstructors()]);
  }

  public onCreateInstructor() {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Add Instructor?',
      nzContent: InstructorCreateModalComponent,
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => !d?.form?.valid,
          onClick: async (instance: InstructorCreateModalComponent) => {
            const { username, firstName, lastName, description } = instance.form.getRawValue();
            const body = {
              username,
              firstName,
              lastName,
              description,
            };
            return this.service.createInstructor(body).subscribe((resp: DeferredResource<InstructorLite>) => {
              if (resp?.isSuccess) {
                modal.destroy();
                this.router.navigate(['admin', 'instructors', 'details', resp.response.id]);
              }
            });
          },
        },
      ],
    });
  }
}
