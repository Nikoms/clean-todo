import { createSlice } from '@reduxjs/toolkit'
import {createTodo, getTodos} from '../todo.service';

export const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    listStatus: 'idle',
    list: [],
  },
  reducers: {
    setTodos: (state, action) => {
      state.list = action.payload;
      state.listStatus = 'resolved';
    },
    loadingListStatus: (state) => {
      state.listStatus = 'pending';
    },
    loadingListFailed: (state, action) => {
      state.listStatus = 'rejected';
      state.listError = action.payload;
    },
    toggleDone: (state, action) => {
      state.list = [
        ...state.list.slice(0, action.payload),
        {...state.list[action.payload], done: !state.list[action.payload].done},
        ...state.list.slice(action.payload + 1)
      ]
    },
    addEmptyTodo:(state) => {
      state.list.push(createTodo('Relax! Edition will come...', false))
    }
  },
})


export const { setTodos, toggleDone, addEmptyTodo } = todoSlice.actions

export const loadTodos = async(dispatch, getState) => {
  if(['idle', 'rejected'].includes(getState().todo.listStatus)){
    try {
      dispatch(todoSlice.actions.loadingListStatus());
      const todos = await getTodos();
      dispatch(setTodos(todos));
    } catch (e) {
      dispatch(todoSlice.actions.loadingListFailed(e));
    }
  }
}

export default todoSlice.reducer
