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

  async loadTodos() {
    try {
      this._setTodoList(await this.useCase.getTodos());
    } catch (e) {
      //Do nothing for the moment
    }
  }

  incrementClickCount() {
    this.update({clickCount: this.viewModel.clickCount + 1});
  }

  update(newValues) {
    this.viewModel = {...this.viewModel, ...newValues};
    this._refreshUI();
  }

  onViewModelChange(callback) {
    this.viewModelListener = callback;
  }

  addEmptyTodo() {
    this._setTodoList([createTodo('Relax! Edition will come...', false), ...this.viewModel.todos]);
  }

  _setTodoList(todos) {
    this.update({
      todos,
      doneCount: todos.filter(t => t.done).length,
      ongoingCount: todos.filter(t => !t.done).length,
    });
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
