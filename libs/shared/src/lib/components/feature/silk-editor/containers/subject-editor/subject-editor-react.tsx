import React, { useState, useMemo, useRef } from 'react';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, Range } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { Action } from '../../actions/actions';
import { LinkElement } from '../../components/components';
import isUrl from 'is-url';
import { ComposerEmittedEventType } from '../../models/silk-editor.model';

const SubjectEditorReact = (props) => {
  const [value, setValue] = useState<Descendant[]>(props && props['initialValue']);
  const editor = useMemo(() => withPlaceholders(withHistory(withReact(createEditor() as ReactEditor))), []);
  const editorSelection = useRef(editor.selection);

  const dispatchAction = (action: Action) => {
    if (action.type === 'add-placeholder') {
      if (!editorSelection.current) {
        props['onOpenModal'](ComposerEmittedEventType.PLACEHOLDER_MISSED);
        return;
      }
      Transforms.select(editor, editorSelection.current);
      insertPlaceholder(props, editor, action.payload);
    }
  };

  const onChange = (val) => {
    setValue(val);
    props['onChange'](val);
    if (editor.selection) {
      editorSelection.current = editor.selection;
    }
  };

  props.passDispatchActionFn(dispatchAction);

  return (
    <Slate editor={editor} value={value} onChange={(val) => onChange(val)}>
      <Editable
        style={{
          fontFamily: 'Arial,sans-serif',
          fontSize: '16px',
          lineHeight: '1.5',
          minHeight: '34px',
          maxHeight: '100px',
          padding: '4px 11px',
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
        renderElement={(p) => <Element {...p} />}
        renderLeaf={(p) => <Leaf {...p} />}
        placeholder="Enter subject..."
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
          }
        }}
      />
    </Slate>
  );
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'placeholder':
      if (element.placeholder.isLink) {
        return (
          <a
            contentEditable={false}
            {...attributes}
            style={{
              backgroundColor: '#cfd0dd',
              marginRight: '1px',
              marginLeft: '1px',
              cursor: 'default',
              pointerEvents: 'none',
            }}
            href="libs/shared/src/lib/components/feature/silk-editor/containers/subject-editor/subject-editor-react#"
            title={element.placeholder.value}>
            {element.placeholder.displayValue}
            {children}
          </a>
        );
      } else {
        return (
          <span
            contentEditable={false}
            {...attributes}
            style={{ backgroundColor: '#cfd0dd', marginRight: '1px', marginLeft: '1px' }}>
            {element.placeholder.value}
            {children}
          </span>
        );
      }
    default:
      return (
        <p {...attributes} style={{ margin: 0, minHeight: '1em' }}>
          {children}
        </p>
      );
  }
};

const insertPlaceholder = (props, editor, placeholder) => {
  if (placeholder.isLink && !placeholder.displayValue) {
    props['onOpenModal'](ComposerEmittedEventType.LINK_TEXT, placeholder);
    return;
  }
  const placeholderItem: any = {
    type: 'placeholder',
    placeholder,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, placeholderItem);
};

const withLinks = (editor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const isLinkActive = (editor) => {
  const [link] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n['type'] === 'link',
  });
  return !!link;
};

const unwrapLink = (editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n['type'] === 'link',
  });
};

const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link: LinkElement = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

const withPlaceholders = (editor) => {
  editor = withLinks(editor);

  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === 'placeholder' ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === 'placehodler' ? true : isVoid(element);
  };

  return editor;
};

export default SubjectEditorReact;
