import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SpCourseDetailsComponent} from "./sp-course-details.component";

const routes: Routes = [
  {
    path: '',
    component: SpCourseDetailsComponent
  },
  {
    path: 'create-new-variant/:variantId',
    loadChildren: async () =>
      import('./containers/sp-course-variants/sp-course-variant-create/sp-course-variant-create.module')
        .then((m) => m.SpCourseVariantCreateModule)
  },
  {
    path: 'variant/details/:variantId',
    loadChildren: async () =>
      import('./containers/sp-course-variants/sp-course-variant-details/sp-course-variant-details.module')
        .then((m) => m.SpCourseVariantDetailsModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpCourseDetailsRoutingModule {
}
