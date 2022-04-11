import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SubjectEditorReact from './subject-editor-react';

export class SubjectView {
  domElement: Element;
  subjectInstance: any;

  initialize(element, props): any {
    this.domElement = element;
    this.subjectInstance = ReactDOM.render(<SubjectEditorReact {...props} />, element) as any;
  }

  setState(value) {
    const state = value;
    this.subjectInstance.onChange({ value: state });
  }

  dispose() {
    ReactDOM.unmountComponentAtNode(this.domElement);
  }
}
