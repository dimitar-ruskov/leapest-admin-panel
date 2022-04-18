import React, { useState, useMemo, useRef } from 'react';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, Range } from 'slate';
import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import { Action } from '../../actions/actions';
import { Toolbar, Button, Icon, LinkElement } from '../../components/components';
import isHotkey from 'is-hotkey';
import isUrl from 'is-url';
import { ComposerEmittedEventType } from '../../models/silk-editor.model';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const SilkEditorReact = (props) => {
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
    if (action.type === 'add-link') {
      Transforms.select(editor, editorSelection.current);
      insertLink(editor, action.payload.href);
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
      <Toolbar>
        <MarkButton format="bold" icon="fa-bold" />
        <MarkButton format="italic" icon="fa-italic" />
        <MarkButton format="underline" icon="fa-underline" />

        <BlockButton format="numbered-list" icon="fa-list-ol" />
        <BlockButton format="bulleted-list" icon="fa-list-ul" />

        <BlockButton format="heading-one" icon="fa-h1" />
        <BlockButton format="heading-two" icon="fa-h2" />

        <LinkButton onOpenModal={() => props['onOpenModal'](ComposerEmittedEventType.LINK_URL)} />
        <RemoveLinkButton />
        <PreviewButton onOpenModal={() => props['onOpenModal'](ComposerEmittedEventType.PREVIEW)} />
      </Toolbar>
      <Editable
        style={{
          padding: '0 15px',
          height: '300px',
          maxHeight: '300px',
          overflowY: 'scroll',
          fontFamily: 'Arial,sans-serif',
        }}
        renderElement={(p) => <Element {...p} />}
        renderLeaf={(p) => <Leaf {...p} />}
        placeholder="Enter some plain text..."
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'link':
      return (
        <a {...attributes} href={element.url} title={element.url}>
          {children}
        </a>
      );
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
            href="libs/shared/src/lib/components/feature/silk-editor/containers/silk-editor/silk-editor-react#"
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
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'quote':
      return (
        <p {...attributes} style={{ margin: 0, minHeight: '1em' }}>
          {children}
        </p>
      );
    default:
      return (
        <p {...attributes} style={{ margin: 0, minHeight: '1em' }}>
          {children}
        </p>
      );
  }
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
  // Transforms.setSelection(editor, editor.lastLocation)
  // editor.selection = editor.lastSelection;

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

const insertLink = (editor, url) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
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

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(!Editor.isEditor(n) && SlateElement.isElement(n) && n['type']),
    split: true,
  });
  const newProperties: Partial<any> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n['type'] === format,
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}>
      <Icon>{icon}</Icon>
    </Button>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}>
      <Icon>{icon}</Icon>
    </Button>
  );
};

const LinkButton = (props) => {
  const editor = useSlate();
  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={(event) => {
        event.preventDefault();
        props['onOpenModal'](ComposerEmittedEventType.LINK_URL);
      }}>
      <Icon>fa-link</Icon>
    </Button>
  );
};

const RemoveLinkButton = () => {
  const editor = useSlate();

  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={(event) => {
        if (isLinkActive(editor)) {
          unwrapLink(editor);
        }
      }}>
      <Icon>fa-chain-broken</Icon>
    </Button>
  );
};

const PreviewButton = (props) => {
  const editor = useSlate();

  return (
    <Button
      style={{
        float: 'right',
        border: '1px solid #acadc1',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#26273b',
        padding: '0 5px',
      }}
      active={isLinkActive(editor)}
      onMouseDown={() => props['onOpenModal'](ComposerEmittedEventType.PREVIEW)}>
      Preview
    </Button>
  );
};

export default SilkEditorReact;
