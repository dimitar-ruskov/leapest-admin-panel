import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { take, tap } from 'rxjs/operators';


export interface EventAgendaController {
  showAgendaSaveChanges: string;
  discardAgendaChanges(): Observable<boolean>;
  saveAgendaChanges(): Observable<boolean>;
}

const UNSAVED_CHANGES_ON_EVENT_AGENDA = 'You have unsaved changes on the event agenda. What do you want to do?';

@Injectable({
  providedIn: 'root'
})
export class EventAgendaUnsavedChangesGuard implements CanDeactivate<EventAgendaController> {

  canDeactivateSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private readonly modalService: NzModalService) {
  }

  canDeactivate(
    component: EventAgendaController,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkIfCanDeactivate(component);
  }

  checkIfCanDeactivate(component: EventAgendaController): Observable<boolean> {
    return component.showAgendaSaveChanges
      ? this.confirmTabDeactivation(component)
      : of(true);
  }

  private confirmTabDeactivation(component: EventAgendaController): Observable<boolean> {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Warning',
      nzContent: UNSAVED_CHANGES_ON_EVENT_AGENDA,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => {
            this.canDeactivateSubject.next(false);
          }
        },
        {
          label: 'Discard',
          type: 'default',
          danger: true,
          onClick: () => {
            return component.discardAgendaChanges()
              .toPromise()
              .then(() => this.canDeactivateSubject.next(true));
          }
        },
        {
          label: 'Save Changes',
          type: 'primary',
          onClick: () => {
            return component.saveAgendaChanges()
              .toPromise()
              .then(() => this.canDeactivateSubject.next(true));
          }
        }
      ]
    });

    return this.canDeactivateSubject.asObservable()
      .pipe(
        take(1),
        tap(() => modal.destroy())
      );
  }
}
