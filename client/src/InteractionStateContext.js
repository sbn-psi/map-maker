import React, { createContext, useContext, useReducer } from 'react';
import { InteractionState } from './AppState';
import { stateReducer } from './InteractionStateReducer';

export const StateContext = createContext()
export const useInteractionState = () => useContext(StateContext)

export const StateDispatchContext = createContext()
export const useInteractionStateDispatch = () => useContext(StateDispatchContext);

export const InteractionStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, new InteractionState());

  return (
    <StateContext.Provider value={state}>
      <StateDispatchContext.Provider value={dispatch}>
        {children}
      </StateDispatchContext.Provider>
    </StateContext.Provider>
  );
};
