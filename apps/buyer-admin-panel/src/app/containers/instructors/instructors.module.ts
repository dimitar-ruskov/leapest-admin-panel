import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { QuillModule } from 'ngx-quill';

import { InstructorsComponent } from './instructors.component';
import { InstructorsListComponent } from './containers/instructors-list/instructors-list.component';
import { InstructorsRoutingModule } from './instructors-routing.module';
import { InstructorsListState } from './state/instructor-list/instructors-list.state';
import { InstructorCreateModalComponent } from './components/instructor-create-modal/instructor-create-modal.component';
import { InstructorDetailsComponent } from './containers/instructor-details/instructor-details.component';
import { InstructorDetailsState } from './state/instructor-details/instructor-details.state';

import {
  TableSearchModule
} from "../../../../../../libs/shared/src/lib/components/common/table-search/table-search.module";
import {FormLabelModule} from "../../../../../../libs/shared/src/lib/components/common/form-label/form-label.module";
import {
  CtaContainerModule
} from "../../../../../../libs/shared/src/lib/components/common/cta-container/cta-container.module";
import {
  EditorCharCountModule
} from "../../../../../../libs/shared/src/lib/components/common/editor-char-count/editor-char-count.module";
import {TGridModule} from "../../../../../../libs/shared/src/lib/components/common/t-grid/t-grid.module";
import {TableGridModule} from "../../../../../../libs/shared/src/lib/components/common/table-grid/table-grid.module";
import {
  TableControlPanelModule
} from "../../../../../../libs/shared/src/lib/components/common/table-control-panel/table-control-panel.module";

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@NgModule({
  declarations: [
    InstructorsComponent,
    InstructorsListComponent,
    InstructorCreateModalComponent,
    InstructorDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InstructorsRoutingModule,

    QuillModule,
    NgxsModule.forFeature([InstructorsListState, InstructorDetailsState]),
    TGridModule,
    TableGridModule,
    TableControlPanelModule,
    TableSearchModule,
    CtaContainerModule,
    EditorCharCountModule,
    FormLabelModule,

    NzTableModule,
    NzTabsModule,
    NzButtonModule,
    NzLayoutModule,
    NzSkeletonModule,
    NzBreadCrumbModule,
    NzSpinModule,
    NzFormModule,
    NzInputModule,
    NzToolTipModule,
    NzSwitchModule,
    NzEmptyModule,
    NzDatePickerModule,
  ]
})
export class InstructorsModule {}
