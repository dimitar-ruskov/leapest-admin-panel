import {
  ADD_IMAGE,
  ADD_LINK,
  ADD_PLACEHOLDER,
  APPLY_CHANGE,
  FOCUS,
  REMOVE_LINK,
  SET_TEXT_COLOR,
  SET_TEXT_SIZE,
  TOGGLE_BLOCK,
  TOGGLE_MARK,
} from './action-types';

import {
  AddImage,
  AddLink,
  AddPlaceholder,
  ApplyChange,
  Focus,
  RemoveLink,
  SetTextColor,
  SetTextSize,
  ToggleBlock,
  ToggleMark,
} from './actions';

export class ActionCreator {
  static addImage(src: string, key?: string, bucket?: string): AddImage {
    return { type: ADD_IMAGE, payload: { src, key, bucket } };
  }

  static addPlaceholder(key: string, value: string, isLink: boolean): AddPlaceholder {
    return { type: ADD_PLACEHOLDER, payload: { key, value, isLink } };
  }

  static addLink(href: string, text?: string): AddLink {
    return { type: ADD_LINK, payload: { href, text } };
  }

  static removeLink(): RemoveLink {
    return { type: REMOVE_LINK, payload: null };
  }

  static toggleMark(type: string): ToggleMark {
    return { type: TOGGLE_MARK, payload: { type } };
  }

  static toggleBlock(type: string): ToggleBlock {
    return { type: TOGGLE_BLOCK, payload: { type } };
  }

  static setTextColor(color = '#000'): SetTextColor {
    return { type: SET_TEXT_COLOR, payload: { color } };
  }

  static setTextSize(size = 11): SetTextSize {
    return { type: SET_TEXT_SIZE, payload: { size } };
  }

  static applyChange(changeFn: (change) => void): ApplyChange {
    return { type: APPLY_CHANGE, payload: { changeFn } };
  }

  static focus(): Focus {
    return { type: FOCUS, payload: null };
  }
}
