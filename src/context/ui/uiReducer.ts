import { UiState } from './';

type UIActionType =
  | { type: '[UI] - toggleMenu' }

export const uiReducer = (state: UiState, action: UIActionType): UiState => {
  switch (action.type) {
    case '[UI] - toggleMenu':
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen
      }
    default:
      return state;
  }
}