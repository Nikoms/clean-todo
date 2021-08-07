import { createSlice } from '@reduxjs/toolkit'

export const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    list: [],
  },
  reducers: {
    addTodo: (state, action) => {
      state.list.push(action.payload);
    }
  },
})

export const { addTodo } = todoSlice.actions

export default todoSlice.reducer
