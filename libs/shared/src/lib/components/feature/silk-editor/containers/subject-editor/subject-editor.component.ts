import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ReplaySubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Action } from '../../actions/actions';
import { ComposerEmittedEventType } from '../../models/silk-editor.model';
import {SubjectView} from "./subject-view";

export const EDITOR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SubjectEditor),
  multi: true,
};

@UntilDestroy()
@Component({
  selector: 'leap-subject-editor',
  template: '<div #editor [id]="rootId"></div>',
  providers: [EDITOR_VALUE_ACCESSOR],
})
export class SubjectEditor implements OnChanges, OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() actionDispatcher$: Subject<Action>;

  view: any;
  wrapper: SubjectView;

  @Output() stateChanged$ = new EventEmitter();
  @Output() openModal = new EventEmitter<{ type: string; data: any }>();

  @ViewChild('editor') editor: ElementRef;

  public rootId = 'subject-editor';
  private hasViewLoaded = false;

  private dispatchActionFn: any;

  private readonly valueUpdated$ = new ReplaySubject();

  ngOnChanges() {
    this.renderComponent();
  }

  ngOnInit() {
    this.wrapper = new SubjectView();

    if (this.actionDispatcher$) {
      this.actionDispatcher$.pipe(untilDestroyed(this)).subscribe((action) => {
        this.dispatchActionFn(action);
      });
    }
  }

  ngAfterViewInit() {
    this.hasViewLoaded = true;

    this.valueUpdated$.pipe(take(1), untilDestroyed(this)).subscribe((value) => {
      this.renderComponent(value);
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.wrapper.dispose();
  }

  private renderComponent(value?: any) {
    if (!this.hasViewLoaded) {
      return;
    }

    const props: any = {
      onChange: (state) => {
        this.stateChanged$.next(state);
        this.changeFn(state);
      },
      passDispatchActionFn: (fn) => {
        this.dispatchActionFn = fn;
      },
      onOpenModal: (type: ComposerEmittedEventType, data?: any) => {
        this.openModal.next({ type, data });
      },
      initialValue: value,
    };
    this.wrapper.initialize(this.editor.nativeElement, props);
  }

  writeValue(obj: any): void {
    this.valueUpdated$.next(obj);
  }

  registerOnChange(fn: any): void {
    this.changeFn = fn;
  }

  registerOnTouched(fn: any): void {}

  changeFn = (value) => {};
}
