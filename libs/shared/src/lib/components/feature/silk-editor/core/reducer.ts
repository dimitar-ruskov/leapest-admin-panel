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
} from '../actions/action-types';

import { Action } from '../actions/actions';
import {
  addImage,
  addLink,
  addPlaceholder,
  removeLinkMark,
  setTextColor,
  setTextSize,
  toggleBlock,
  toggleMark,
} from './changes';

export const applyChange = (actions: Action | Action[], change, value) => {
  const actionsArray = actions instanceof Array ? actions : [actions];

  for (const action of actionsArray) {
    switch (action.type) {
      case FOCUS:
        change.focus();
        break;
      case TOGGLE_BLOCK:
        toggleBlock(action, change, value);
        break;
      case TOGGLE_MARK:
        toggleMark(action, change, value);
        break;
      case ADD_IMAGE:
        addImage(action, change, value);
        break;
      case ADD_LINK:
        addLink(action, change, value);
        break;
      case REMOVE_LINK:
        removeLinkMark(action, change, value);
        break;
      case ADD_PLACEHOLDER:
        addPlaceholder(action, change, value);
        break;
      case SET_TEXT_COLOR:
        setTextColor(action, change, value);
        break;
      case SET_TEXT_SIZE:
        setTextSize(action, change, value);
        break;
      case APPLY_CHANGE:
        return action.payload.changeFn(change);
    }
  }

  return change;
};
