import {applyMiddleware, configureStore} from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk'
import todoReducer from './Todo/store/todo.store';
import { composeWithDevTools } from 'redux-devtools-extension'
const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))
const rootReducer = {
  reducer: {
    todo: todoReducer
  }
};
export default configureStore(rootReducer, composedEnhancer);

export const buildNewStore = () => {
  return configureStore(rootReducer, composedEnhancer);
}
