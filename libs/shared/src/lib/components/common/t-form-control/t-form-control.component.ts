import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { TFormControlConfig, TFormControlConfigOption } from '../../../models/dump-components/t-form-input.model';

@Component({
  selector: 'leap-t-form-control',
  templateUrl: './t-form-control.component.html',
  styleUrls: ['./t-form-control.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TFormControlComponent implements ControlValueAccessor, OnInit {
  @Input() config: TFormControlConfig;

  @Output() createNewOption = new EventEmitter();

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }
  inputValue?: string;
  options: Observable<TFormControlConfigOption[]> = of([]);
  isLoading = false;
  onInput(search: string, serverSideFilterFn: (f: string) => Observable<TFormControlConfigOption[]>): void {
    if (search) {
      this.options = serverSideFilterFn(search);
    }
  }

  ngOnInit() {}

  writeValue(obj: any) {}

  registerOnChange(fn: any) {}

  registerOnTouched(fn: any) {}

  setDisabledState(isDisabled: boolean) {}
}
