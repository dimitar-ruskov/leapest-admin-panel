import { BlockType } from '../renderers/types';

export interface ISelection {
  start: number;
  end: number;
}

const ALIGN_MARK_PREFIX = 'align_';

function isBlock(blockType: string, value): boolean {
  const { document, blocks } = value;
  if (blockType === BlockType.NUMBERED_LIST || blockType === BlockType.UNORDERED_LIST) {
    // The selected blocks should have the same parent blockType
    if (blocks.size > 0) {
      return blocks.every((block) => document.getParent(block.key).type === blockType);
    }

    return false;
  }

  return blocks.every((node) => node.type === blockType);
}

function hasInline(inlineType: string, state: any): boolean {
  return state.inlines.some((i) => i.type === inlineType);
}

function hasBlock(blockType: string, value): boolean {
  return value.blocks.some((node) => node.type == blockType);
}

function hasMark(markType: string, value): boolean {
  if (markType.startsWith(ALIGN_MARK_PREFIX)) {
    const direction = markType.substring(ALIGN_MARK_PREFIX.length);
    return value.blocks.every((b) => (b.get('data').get('align') || 'left') === direction);
  }

  return value.activeMarks.some((mark) => mark.type === markType);
}

function getSelectionForMark(change, markType: string): ISelection {
  let startPos = change.value.selection.startOffset;
  while (change.value.document.getMarksAtRange(change.value.selection).some((mark) => mark.type === markType)) {
    change = change.move(-1);
    startPos--;
  }

  change = change.move(1);
  let endPos = startPos;

  while (change.value.document.getMarksAtRange(change.value.selection).some((mark) => mark.type === markType)) {
    change = change.move(1);
    endPos++;
  }

  return {
    start: startPos,
    end: endPos,
  };
}

export { isBlock, hasBlock, hasInline, hasMark, getSelectionForMark };
