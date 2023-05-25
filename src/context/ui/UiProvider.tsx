import { FC, useReducer } from 'react';
import { UiContext, uiReducer } from './'

export interface UiState {
  isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
  isMenuOpen: false
}

interface Props {
  children: React.ReactNode
}

export const UIProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleSideMenu = () => {
    dispatch({type:'[UI] - toggleMenu'})
  }
  return (
    <UiContext.Provider value={{
      ...state,

      // Methods
      toggleSideMenu
    }}>
      {children}
    </UiContext.Provider>
  )
};