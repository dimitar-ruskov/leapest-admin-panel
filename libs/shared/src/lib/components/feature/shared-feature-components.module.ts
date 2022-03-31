import {NgModule} from '@angular/core';
import {CertificatePreviewModule} from "./certificate-preview/certificate-preview.module";
import {CertificateSelectModule} from "./certificate-select/certificate-select.module";
import {CertificateViewModule} from "./certificate-view/certificate-view.module";
import {CourseMaterialsInputModule} from "./course-materials-input/course-materials-input.module";
import {EditCourseCertificateModule} from "./edit-course-certificate/edit-course-certificate.module";
import {EventHeaderSectionsModule} from "./event-header-sections/event-header-sections.module";
import {
  InstructorsCollisionsWarningsModule
} from "./instructors-collisions-warnings/instructors-collisions-warnings.module";
import {InternalRepoTileModule} from "./internal-repo-tile/internal-repo-tile.module";
import {MasterInternalRepoTileModule} from "./master-internal-repo-tile/master-internal-repo-tile.module";
import {SelectCategoryInputModule} from "./select-category-input/select-category-input.module";
import {SelectSubCategoryInputModule} from "./select-sub-category-input/select-sub-category-input.module";
import {TAgendaModule} from "./t-agenda/t-agenda.module";
import {TypeTileModule} from "./type-tile/type-tile.module";

const components = [
  CertificatePreviewModule,
  CertificateSelectModule,
  CertificateViewModule,
  CourseMaterialsInputModule,
  EditCourseCertificateModule,
  EventHeaderSectionsModule,
  InstructorsCollisionsWarningsModule,
  InternalRepoTileModule,
  MasterInternalRepoTileModule,
  SelectCategoryInputModule,
  SelectSubCategoryInputModule,
  TAgendaModule,
  TypeTileModule
];

@NgModule({
  imports: components,
  exports: components
})
export class SharedFeatureComponentsModule {
}
