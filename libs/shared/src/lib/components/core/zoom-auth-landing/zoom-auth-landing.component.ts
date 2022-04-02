import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import {DeferredResource} from "../../../utils/common";
import {ConferencingToolService} from "../../../utils/services/feature";

type PageType = 'details' | 'create';

@Component({
  selector: 'leap-zoom-auth-landing',
  templateUrl: './zoom-auth-landing.component.html',
  styleUrls: ['./zoom-auth-landing.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class ZoomAuthLandingComponent implements OnInit {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly conferencingToolService: ConferencingToolService,
    private readonly router: Router,
  ) {}

  eventId: string;
  page: PageType;
  authResult$: Observable<DeferredResource<boolean>>;
  pending: boolean;
  isError: boolean;

  ngOnInit(): void {
    this.authResult$ = this.route.queryParams.pipe(
      take(1),
      switchMap((params) => {
        const p = params['state'].split(',');
        this.page = (p[0] as PageType) || null;
        this.eventId = p[1];
        return this.conferencingToolService.authorizeZoom(
          params['code'],
          `${window.location.origin}/hw/admin/zoom-auth-landing`,
        );
      }),
    );
    this.authResult$.pipe(untilDestroyed(this)).subscribe((authResult: DeferredResource<boolean>) => {
      this.pending = authResult.pending;
      this.isError = !!authResult.error;
      if (authResult.isSuccess && authResult.response && this.page && this.eventId) {
        this.router.navigate(
          ['admin', 'ilt-events', this.page, this.eventId],
          this.page === 'create' ? { queryParams: { zoomRedirect: true } } : {},
        );
      }
    });
  }
}
