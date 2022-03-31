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
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Action } from './actions/actions';
import { SilkView } from './silk-view';

export const EDITOR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SilkEditor),
  multi: true,
};

@UntilDestroy()
@Component({
  selector: 'leap-silk-editor',
  template: '<div #editor [id]="rootId"></div>',
  providers: [EDITOR_VALUE_ACCESSOR],
})
export class SilkEditor implements OnChanges, OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() actionDispatcher$: Observable<Action>;

  view: any;
  wrapper: SilkView;

  @Output() stateChanged$ = new EventEmitter();
  @Output() previewClicked = new EventEmitter();

  @ViewChild('editor') editor: ElementRef;

  public rootId = 'silk-editor';
  private hasViewLoaded = false;

  private dispatchActionFn: any;

  private readonly valueUpdated$ = new ReplaySubject();

  public ngOnChanges() {
    this.renderComponent();
  }

  ngOnInit() {
    this.wrapper = new SilkView();

    if (this.actionDispatcher$) {
      this.actionDispatcher$.pipe(untilDestroyed(this)).subscribe((action) => {
        this.dispatchActionFn(action);
      });
    }
  }

  public ngAfterViewInit() {
    this.hasViewLoaded = true;
    // this.renderComponent();

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
      onPreviewClicked: () => {
        this.previewClicked.next(null);
      },
      initialValue: value,
    };
    this.wrapper.initialize(this.editor.nativeElement, props);
  }

  resetFocus() {
    // if (this.view) this.view.focus();
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
