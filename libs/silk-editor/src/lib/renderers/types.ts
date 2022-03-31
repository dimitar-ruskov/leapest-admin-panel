const BlockType = Object.freeze({
  PARAGRAPH: 'paragraph',
  HEADING_ONE: 'heading-one',
  HEADING_TWO: 'heading-two',
  IMAGE: 'image',
  UNORDERED_LIST: 'bulleted-list',
  NUMBERED_LIST: 'numbered-list',
  LIST_ITEM: 'list-item',
});

const InlineType = Object.freeze({
  PLACEHOLDER: 'leap-placeholder',
  LINK: 'link',
});

const MarkType = Object.freeze({
  BOLD: 'bold',
  ITALIC: 'italic',
  UNDERLINED: 'underlined',
  COLOR: 'color',
  SIZE: 'size',
  GREYED_SELECT: 'greyed-select',
});

export { MarkType, InlineType, BlockType };

export interface EmptyText {
  text: string;
}

export interface PlaceholderElement {
  type: 'placeholder';
  key: string;
  children: EmptyText[];
}
