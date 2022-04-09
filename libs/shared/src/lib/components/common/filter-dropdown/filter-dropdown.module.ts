import { NgModule } from '@angular/core';
import { FilterDropdownComponent } from './filter-dropdown.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [FilterDropdownComponent],
  exports: [FilterDropdownComponent],
  imports: [CommonModule, FormsModule, NzDropDownModule, NzCheckboxModule, NzTableModule, NzButtonModule, NzMenuModule],
})
export class FilterDropdownModule {}
