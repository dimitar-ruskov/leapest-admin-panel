import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SilkEditorReact from './silk-editor-react';

export class SilkView {
  domElement: Element;
  silkInstance: any;

  initialize(element, props): any {
    this.domElement = element;
    this.silkInstance = ReactDOM.render(<SilkEditorReact {...props} />, element) as any;
  }

  setState(value) {
    const state = value;
    this.silkInstance.onChange({ value: state });
  }

  dispose() {
    ReactDOM.unmountComponentAtNode(this.domElement);
  }
}
