import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export const TYPES = {
  'ilt-courses': {
    typeName: 'Courses',
    breadcrumbsTitle: 'Instructor-led Course Catalog',
  },
  'ilt-events': {
    typeName: 'Events',
    breadcrumbsTitle: 'Instructor-led Course Events',
  },
  'self-paced-courses': {
    typeName: 'Self paced courses',
    breadcrumbsTitle: 'Self paced courses',
  },
  'internal-repository': {
    typeName: 'Internal Repository',
    breadcrumbsTitle: 'Internal Repository',
  },
  'marketplace-repo': {
    typeName: 'Marketplace Repository',
    breadcrumbsTitle: 'Marketplace Repository',
  },
  certificates: {
    typeName: 'Certificates',
    breadcrumbsTitle: 'Certificate Templates',
  },
};

@Component({
  selector: 'leap-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent implements OnInit {
  public entityType: string;
  public typeTitle: string;
  public breadcrumbsTitle: string;

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {}

  ngOnInit(): void {
    this.entityType = this.route.snapshot.params.type;
    this.typeTitle = TYPES[this.entityType]?.typeName;
    this.breadcrumbsTitle = TYPES[this.entityType]?.breadcrumbsTitle;
  }

  goBack(): void {
    this.router.navigate(['admin', this.entityType]);
  }
}
