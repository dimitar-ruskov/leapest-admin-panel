// import { Mark } from "slate";

import { BlockType, InlineType } from '../renderers/types';
import {
  AddImage,
  AddLink,
  AddPlaceholder,
  RemoveLink,
  SetTextColor,
  SetTextSize,
  ToggleBlock,
  ToggleMark,
} from '../actions/actions';
import { hasBlock } from '../utils/selection';
// import { SilkTypes } from "../silk";

const ALIGN_PREFIX = 'align_';
const DEFAULT_NODE = BlockType.PARAGRAPH;

export const toggleBlock = ({ payload }: ToggleBlock, change, value) => {
  const { type } = payload;
  const { document } = value;

  const hasListBlock = hasBlock(BlockType.LIST_ITEM, value);
  if (type === BlockType.NUMBERED_LIST || type === BlockType.UNORDERED_LIST) {
    const hasBlocksOfSameType = value.blocks.some(
      (block) => !!document.getClosest(block.key, (parent) => parent.type == type),
    );

    if (hasListBlock) {
      if (hasBlocksOfSameType) {
        change
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock(BlockType.UNORDERED_LIST)
          .unwrapBlock(BlockType.NUMBERED_LIST);
      } else {
        const otherListType = type === BlockType.UNORDERED_LIST ? BlockType.NUMBERED_LIST : BlockType.UNORDERED_LIST;
        change.unwrapBlock(otherListType).wrapBlock(type);
      }
    } else {
      change.setBlocks(BlockType.LIST_ITEM).wrapBlock(type);
    }
  } else {
    if (hasListBlock) {
      change.unwrapBlock(BlockType.UNORDERED_LIST).unwrapBlock(BlockType.NUMBERED_LIST);
    }

    const isActive = hasBlock(type, value);
    change.setBlocks(isActive ? DEFAULT_NODE : type);
  }
};

export const toggleMark = ({ payload }: ToggleMark, change, value) => {
  const { type } = payload;

  if (type.startsWith(ALIGN_PREFIX)) {
    const direction = type.substring(ALIGN_PREFIX.length);
    value.blocks.forEach((block) => {
      const data = block.get('data').set('align', direction);
      change.setNodeByKey(block.get('key'), { data: data });
    });
  } else {
    change.toggleMark(type);
  }
};

export const addLink = ({ payload }: AddLink, change, value) => {
  const { href, text } = payload;
  if (value.isEmpty) {
    if (text && text.length > 0) {
      change.insertText(text).extend(-text.length);
    } else {
      return;
    }
  }

  change.wrapInline({ type: InlineType.LINK, data: { href } }).collapseToEnd();
};

export const removeLinkMark = (action: RemoveLink, change, value) => {
  change.unwrapInline(InlineType.LINK);
};

export const addPlaceholder = ({ payload }: AddPlaceholder, change, value) => {
  const { startBlock, endBlock, startInline, endInline } = value;
  // If either edge of current selection is within a void node,
  // slate will attempt to split it, causing duplications and editor crashes
  if (startBlock.isVoid || endBlock.isVoid || (startInline && startInline.isVoid) || (endInline && endInline.isVoid)) {
    return;
  }

  change
    /* It's important to wrap around non-empty text,
     *  otherwise slate strips away applied marks
     */
    .insertText(' ')
    .extend(-1)
    .wrapInline({
      type: InlineType.PLACEHOLDER,
      isVoid: true,
      data: payload,
    })
    .collapseToEnd();
};

export const addImage = ({ payload }: AddImage, change, value) => {
  const { src } = payload;
  change.insertBlock({ type: BlockType.IMAGE, isVoid: true, data: { src } }).insertBlock(BlockType.PARAGRAPH);
};

export const setTextColor = ({ payload }: SetTextColor, change, value) => {
  // const { color } = payload;
  // value.marks
  //   .filter(m => m.type === SilkTypes.MarkType.COLOR)
  //   .forEach(m => change.removeMark(m));
  // change.addMark(
  //   Mark.create({
  //     type: SilkTypes.MarkType.COLOR,
  //     data: {
  //       color
  //     }
  //   })
  // );
};

export const setTextSize = ({ payload }: SetTextSize, change, value) => {
  // const { size } = payload;
  // value.marks
  //   .filter(m => m.type === SilkTypes.MarkType.SIZE)
  //   .forEach(m => change.removeMark(m));
  // change.addMark(
  //   Mark.create({
  //     type: SilkTypes.MarkType.SIZE,
  //     data: {
  //       size
  //     }
  //   })
  // );
};
