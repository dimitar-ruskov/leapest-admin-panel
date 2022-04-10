import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FlattenedCourseInfoComponent } from './flattened-course-info.component';

@NgModule({
    declarations: [FlattenedCourseInfoComponent],
    imports: [
        CommonModule,
        NzButtonModule
    ],
    exports: [
        FlattenedCourseInfoComponent
    ]
})
export class FlattenedCourseInfoModule { }