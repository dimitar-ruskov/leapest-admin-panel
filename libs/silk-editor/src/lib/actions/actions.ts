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

export interface AddImage {
  type: typeof ADD_IMAGE;
  payload: {
    src: string;
    key?: string;
    bucket?: string;
  };
}

export interface AddPlaceholder {
  type: typeof ADD_PLACEHOLDER;
  payload: {
    key: string;
    value: string;
    isLink: boolean;
  };
}

export interface AddLink {
  type: typeof ADD_LINK;
  payload: {
    href: string;
    text?: string;
  };
}

export interface RemoveLink {
  type: typeof REMOVE_LINK;
  payload: void;
}

export interface ToggleMark {
  type: typeof TOGGLE_MARK;
  payload: {
    type: string;
  };
}

export interface ToggleBlock {
  type: typeof TOGGLE_BLOCK;
  payload: {
    type: string;
  };
}

export interface SetTextColor {
  type: typeof SET_TEXT_COLOR;
  payload: {
    color: string;
  };
}

export interface SetTextSize {
  type: typeof SET_TEXT_SIZE;
  payload: {
    size: number;
  };
}

export interface ApplyChange {
  type: typeof APPLY_CHANGE;
  payload: {
    changeFn: (change) => any;
  };
}

export interface Focus {
  type: typeof FOCUS;
  payload: void;
}

export type Action =
  | AddImage
  | AddLink
  | RemoveLink
  | AddPlaceholder
  | ToggleMark
  | ToggleBlock
  | SetTextColor
  | SetTextSize
  | ApplyChange
  | Focus;
