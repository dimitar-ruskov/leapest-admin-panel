import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import {map, switchMap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import { OktaAuthStateService } from '@okta/okta-angular';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { IltEventsService } from '../../../../../../../../libs/shared/src/lib/services/events/ilt-events.service';
import { ChangeILTEventsListTab } from './state/ilt-events.actions';
import {IltEventsListState} from "./state/ilt-events.state";

import {IKeyValuePair, ILTEventBase} from "../../../../../../../../libs/shared/src/lib/models";
import {
  EventCreateModalComponent
} from "../../../../../../../../libs/shared/src/lib/components/modals/event-create-modal/event-create-modal.component";

@Component({
  selector: 'leap-ilt-events-list',
  templateUrl: './ilt-events-list.component.html',
  styleUrls: ['./ilt-events-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltEventsListComponent implements OnInit {
  @Select(IltEventsListState.activeTab)
  activeTab$: Observable<number>;

  isAdmin: Promise<boolean>;
  isDeliveryManager: Promise<boolean>;

  courseOptionsForEvent: IKeyValuePair[];
  constructor(
    private readonly store: Store,
    private readonly modalService: NzModalService,
    private readonly service: IltEventsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly oktaAuthStateService: OktaAuthStateService,
  ) {}

  ngOnInit() {
    this.store.dispatch(new ChangeILTEventsListTab({ activeTab: 0 }));
    this.service
      .getCourseOptionsForEvent()
      .pipe(map((t) => t.data))
      .subscribe((res) => (this.courseOptionsForEvent = res));

    this.isAdmin = this.checkGroups(['buyer-admin']);
    this.isDeliveryManager = this.checkGroups(['solar-partner']);
  }

  onSelectTab(activeTab: number): void {
    this.store.dispatch(new ChangeILTEventsListTab({ activeTab }));
  }

  onCreate() {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'What would you like to create?',
      nzContent: EventCreateModalComponent,
      nzComponentParams: {
        courseOptionsForEvent: this.courseOptionsForEvent,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'text',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Proceed',
          type: 'primary',
          disabled: (d) => !d.eventCreationForm.valid,
          onClick: async (data) => {
            const formValue = data.eventCreationForm.getRawValue();
            return this.service
              .getILTCourse(formValue.courseId)
              .pipe(
                switchMap((course) => {
                  if (course.response) {
                    const payload: ILTEventBase = {
                      classEvent: { virtualVenue: formValue.virtual },
                      course: { id: formValue.courseId },
                      historical: formValue.historical,
                      isInternal: course.response.isInternal,
                    };

                    return this.service.initiateILTEventCreation(payload).pipe(
                      map((t) => t.data),
                      untilDestroyed(this),
                    );
                  }
                  return of(null);
                }),
              )
              .toPromise()
              .then((result) => {
                if (result) {
                  modal.destroy();
                  this.router.navigate(['create', result.sku], { relativeTo: this.route });
                }
              });
          },
        },
      ],
    });
  }

  async checkGroups(allowedGroups: string[]) {
    const oktaUser = await this.oktaAuthStateService['oktaAuth'].getUser();
    const oktaGroups = oktaUser['mkpGroups'];
    return allowedGroups.some((r) => oktaGroups.includes(r));
  }
}
