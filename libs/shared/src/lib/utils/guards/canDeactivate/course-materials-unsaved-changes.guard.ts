import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { take, tap } from 'rxjs/operators';

export interface CourseMaterialsController {
  showMaterialsSaveChanges: string;
  discardMaterialsChanges(): Observable<boolean>;
  saveMaterialsChanges(): Observable<boolean>;
}

const UNSAVED_CHANGES_ON_COURSE_MATERIALS = 'You have unsaved changes on the course materials. What do you want to do?';

@Injectable({
  providedIn: 'root',
})
export class CourseMaterialsUnsavedChangesGuard implements CanDeactivate<CourseMaterialsController> {
  canDeactivateSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private readonly modalService: NzModalService) {}

  canDeactivate(
    component: CourseMaterialsController,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkIfCanDeactivate(component);
  }

  checkIfCanDeactivate(component: CourseMaterialsController): Observable<boolean> {
    return component.showMaterialsSaveChanges ? this.confirmTabDeactivation(component) : of(true);
  }

  private confirmTabDeactivation(component: CourseMaterialsController): Observable<boolean> {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Warning',
      nzContent: UNSAVED_CHANGES_ON_COURSE_MATERIALS,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => {
            this.canDeactivateSubject.next(false);
          },
        },
        {
          label: 'Discard',
          type: 'default',
          danger: true,
          onClick: async () => {
            return component
              .discardMaterialsChanges()
              .toPromise()
              .then(() => this.canDeactivateSubject.next(true));
          },
        },
        {
          label: 'Save Changes',
          type: 'primary',
          onClick: async () => {
            return component
              .saveMaterialsChanges()
              .toPromise()
              .then(() => this.canDeactivateSubject.next(true));
          },
        },
      ],
    });

    return this.canDeactivateSubject.asObservable().pipe(
      take(1),
      tap(() => modal.destroy()),
    );
  }
}
