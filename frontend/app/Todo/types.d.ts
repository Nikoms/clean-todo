export type TodoListViewModel = {
  todos: TodoItem[]
  doneCount: number
  ongoingCount: number
  clickCount: number
}

export type TodoItem  = {
  id:string
  title:string
  done:boolean
}
