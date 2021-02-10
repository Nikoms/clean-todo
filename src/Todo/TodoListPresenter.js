import {createTodo} from './todo.service';

export class TodoListPresenter {
  constructor(getTodos) {
    this.useCase = {
      getTodos,
    };
    this.viewModelListener = (viewModel) => null;
    this.viewModel = {
      todos: [],
      doneCount: 0,
      ongoingCount: 0,
      clickCount: 0,
    };
  }

  loadTodos() {
    this.useCase.getTodos().then(todos => this._setTodoList(todos));
  }

  incrementClickCount() {
    this.viewModel.clickCount += 1;
    this._refreshUI();
  }

  onViewModelChange(callback) {
    this.viewModelListener = callback;
  }

  addEmptyTodo() {
    this._setTodoList([createTodo('Relax! Edition will come...', false), ...this.viewModel.todos]);
  }

  _setTodoList(todos) {
    this.viewModel.todos = todos;
    this.viewModel.doneCount = todos.filter(t => t.done).length;
    this.viewModel.ongoingCount = todos.filter(t => !t.done).length;

    this._refreshUI();
  }

  _refreshUI() {
    this.viewModelListener(this.immutableViewModel());
  }

  immutableViewModel() {
    return {...this.viewModel};
  }

  toggleDone(index) {
    this._setTodoList([
      ...this.viewModel.todos.slice(0, index),
      {...this.viewModel.todos[index], done: !this.viewModel.todos[index].done},
      ...this.viewModel.todos.slice(index + 1)]);
  }
}
