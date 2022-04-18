import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OktaAuthStateService } from '@okta/okta-angular';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import produce from 'immer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTabsCanDeactivateFn } from 'ng-zorro-antd/tabs';

import { EventInfoEditHandlerService } from '../../../../../../../../libs/shared/src/lib/services/events/event-info-edit-handler.service';
import {
  AssignLearnersToILTEvent,
  ChangeILTEventAttendancesFilter,
  ChangeILTEventAttendancesPage,
  DiscardILTEventAgendaChanges,
  GetCompleteILTEventDetails,
  GetILTEventAttendancesByUsers,
  UpdateILTEventAgenda,
  UploadLearnersFromCSVToILTEvent,
} from './state/ilt-event-details.actions';
import { IltEventDetailsState } from './state/ilt-event-details.state';

import { WaitingListState } from './containers/waiting-list/state/waiting-list.state';
import {
  IKeyValuePair,
  ILTCourseAgenda,
  ILTEvent,
  ILTEventLearner
} from "../../../../../../../../libs/shared/src/lib/models";
import {DeferredResource} from "../../../../../../../../libs/shared/src/lib/utils/common";
import {
  AssignUsersModalComponent
} from "../../../../../../../../libs/shared/src/lib/components/modals/assign-users-modal/assign-users-modal.component";
import {EnvironmentService} from "../../../../../../../../libs/shared/src/lib/services/common";
import {
  EventAgendaController,
  EventAgendaUnsavedChangesGuard
} from "../../../../../../../../libs/shared/src/lib/utils/guards";
import {AdminCoursesService} from "../../../../../../../../libs/shared/src/lib/utils/services";

export type ButtonState = 'loading' | 'active' | 'disabled';

@UntilDestroy()
@Component({
  selector: 'leap-ilt-events-details',
  templateUrl: './ilt-events-details.component.html',
  styleUrls: ['./ilt-events-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IltEventsDetailsComponent implements OnInit, EventAgendaController {
  readonly historicalWarningMessage: string =
    'This is historical event created for reporting purposes. Some event management is not available.';

  readonly finishedEventWarningMessage: string = 'Changes for these event may interrupt your Reporting.';

  eventSku: string;

  showAgendaSaveChanges: ButtonState;
  templateAgenda: ILTCourseAgenda;
  showNotifications: boolean;

  @Select(IltEventDetailsState.iltEvent)
  iltEvent$: Observable<DeferredResource<ILTEvent>>;

  @Select(WaitingListState.total)
  waitingListTotal$: Observable<number>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly modalService: NzModalService,
    private readonly eventInfoEditHandlerService: EventInfoEditHandlerService,
    private readonly eventAgendaUnsavedChangesGuard: EventAgendaUnsavedChangesGuard,
    private readonly detector: ChangeDetectorRef,
    private readonly adminCourseService: AdminCoursesService,
    public readonly environmentService: EnvironmentService,
    private readonly oktaAuthStateService: OktaAuthStateService,
  ) {}

  canDeactivateTab: NzTabsCanDeactivateFn = (fromIndex: number) => {
    if (fromIndex === 2 && this.showAgendaSaveChanges) {
      return this.eventAgendaUnsavedChangesGuard.checkIfCanDeactivate(this);
    }

    return true;
  };

  @HostListener('window:pagehide', ['$event'])
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event): void {
    if (this.showAgendaSaveChanges) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  async ngOnInit() {
    this.route.params.pipe(take(1)).subscribe((params) => {
      this.eventSku = params.sku;
      this.store.dispatch([
        new GetCompleteILTEventDetails(params.sku),
        new ChangeILTEventAttendancesPage(1),
        new ChangeILTEventAttendancesFilter(''),
        new GetILTEventAttendancesByUsers(params.sku),
      ]);
    });

    const adminPermissions = await this.checkGroups(['buyer-admin', 'solar-partner']);
    if (adminPermissions) {
      this.showNotifications = true;
    }
  }

  async checkGroups(allowedGroups: string[]) {
    const oktaUser = await this.oktaAuthStateService['oktaAuth'].getUser();
    const oktaGroups = oktaUser['mkpGroups'];
    return allowedGroups.some((r) => oktaGroups.includes(r));
  }

  onAssignUsersClicked(iltEvent: ILTEvent): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Assign Users',
      nzContent: AssignUsersModalComponent,
      nzWrapClassName: 'modal-class',
      nzComponentParams: {
        data: iltEvent,
      },
      nzWidth: 690,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'text',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Proceed',
          type: 'primary',
          disabled: (d) => d.validateLearners,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const lxpGroupUsersEmails = data.lxpGroupUsers ? data.lxpGroupUsers.map((u) => u.key) : [];
            const learnersList = data.bulkLearners
              ? (data.bulkLearners as ILTEventLearner[]).map((learner) => learner.username)
              : [...(formValue.lxpUsers ?? []), ...(formValue.emailUsers ?? []), ...lxpGroupUsersEmails];

            return this.adminCourseService
              .validateLearnerSession(data.data.course.parentId, learnersList)
              .pipe(
                map((items: IKeyValuePair[]) => items.filter((item) => !item.value).map((item) => item.key)),
                switchMap((invalidUsers) => {
                  if (invalidUsers.length === 0) {
                    return data.bulkLearners
                      ? this.store.dispatch([new UploadLearnersFromCSVToILTEvent(iltEvent.id, data.bulkLearners)])
                      : this.store.dispatch([
                          new AssignLearnersToILTEvent(iltEvent.id, [
                            ...(formValue.lxpUsers ?? []),
                            ...(formValue.emailUsers ?? []),
                            ...lxpGroupUsersEmails,
                          ]),
                        ]);
                  } else {
                    data.setErrorMessage(invalidUsers);
                    return of(null);
                  }
                }),
              )
              .toPromise()
              .then((_) => {
                if (_) {
                  modal.destroy();
                }
              });
          },
        },
      ],
    });
  }

  onEditEventDetailsProp(fieldId: string, iltEvent: ILTEvent): void {
    this.eventInfoEditHandlerService.editProperty(fieldId, iltEvent);
  }

  onAgendaValueAndValidityChange({
    valid,
    changed,
    value,
  }: {
    valid: boolean;
    changed: boolean;
    value: ILTCourseAgenda;
  }): void {
    if (changed) {
      this.showAgendaSaveChanges = valid ? 'active' : 'disabled';
    }
    this.templateAgenda = value;
    this.detector.markForCheck();
  }

  onAgendaSaveChanges(): void {
    this.saveAgendaChanges().subscribe();
  }

  saveAgendaChanges(): Observable<boolean> {
    this.showAgendaSaveChanges = 'loading';
    this.detector.markForCheck();

    return this.iltEvent$.pipe(
      take(1),
      switchMap((deferredResource: DeferredResource<ILTEvent>) => {
        const payload = produce(deferredResource.response, (a: ILTEvent) => {
          a.hierarchicalAgenda = this.templateAgenda.days.map((d) => {
            return {
              startDateTime: d.startDateTime,
              items: d.items.map((i) => {
                return { description: i.description, duration: i.duration, title: i.title, type: i.type, id: i.id };
              }),
            };
          });
        });

        return this.store.dispatch([new UpdateILTEventAgenda(payload, 'agenda')]).pipe(
          take(1),
          map(() => {
            this.showAgendaSaveChanges = null;
            this.detector.markForCheck();

            return true;
          }),
        );
      }),
    );
  }

  discardAgendaChanges(): Observable<boolean> {
    return this.store.dispatch(new DiscardILTEventAgendaChanges()).pipe(
      take(1),
      map(() => {
        this.showAgendaSaveChanges = null;
        this.detector.markForCheck();

        return true;
      }),
    );
  }
}
