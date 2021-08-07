import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './Todo/store/todo.store';
export default configureStore({
  reducer: {
    todo: todoReducer
  }
});
